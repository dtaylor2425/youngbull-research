from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

import requests
from sqlalchemy import select

from app.db import session_scope
from app.tables import PremiumCache

BASE_URL = "https://www.alphavantage.co/query"
DATASETS = {
    "overview": "OVERVIEW",
    "income": "INCOME_STATEMENT",
    "balance": "BALANCE_SHEET",
    "cashflow": "CASH_FLOW",
    "earnings": "EARNINGS",
    "estimates": "EARNINGS_ESTIMATES",
}

class AlphaVantageError(RuntimeError):
    pass

def _key() -> str:
    key = os.getenv("ALPHA_VANTAGE_API_KEY")
    if not key:
        raise AlphaVantageError("ALPHA_VANTAGE_API_KEY is not configured")
    return key

def fetch_dataset(ticker: str, dataset: str, max_age_hours: int = 24 * 7) -> dict:
    if dataset not in DATASETS:
        raise AlphaVantageError(f"Unsupported dataset: {dataset}")

    symbol = ticker.upper()
    cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=max_age_hours)

    with session_scope() as session:
        cached = session.scalar(
            select(PremiumCache).where(
                PremiumCache.ticker == symbol,
                PremiumCache.dataset == dataset,
            )
        )
        if cached and cached.fetched_at >= cutoff:
            return cached.payload

    response = requests.get(
        BASE_URL,
        params={"function": DATASETS[dataset], "symbol": symbol, "apikey": _key()},
        timeout=30,
    )
    response.raise_for_status()
    payload = response.json()

    if "Note" in payload or "Information" in payload:
        raise AlphaVantageError(payload.get("Note") or payload.get("Information"))
    if "Error Message" in payload:
        raise AlphaVantageError(payload["Error Message"])

    with session_scope() as session:
        cached = session.scalar(
            select(PremiumCache).where(
                PremiumCache.ticker == symbol,
                PremiumCache.dataset == dataset,
            )
        )
        if cached:
            cached.payload = payload
            cached.fetched_at = datetime.utcnow()
        else:
            session.add(PremiumCache(ticker=symbol, dataset=dataset, payload=payload))

    return payload

def build_premium_workbook(ticker: str, refresh: bool = False) -> dict:
    max_age = 0 if refresh else 24 * 7
    data = {}
    errors = {}
    for dataset in DATASETS:
        try:
            data[dataset] = fetch_dataset(ticker, dataset, max_age_hours=max_age)
        except Exception as exc:
            errors[dataset] = str(exc)
            data[dataset] = {}
    return {"ticker": ticker.upper(), "datasets": data, "errors": errors}
