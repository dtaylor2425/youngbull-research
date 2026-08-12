from __future__ import annotations

import os
import time
from typing import Any

import requests

FRED_BASE = "https://api.stlouisfed.org/fred/series/observations"

SERIES = {
    "DGS10": {"label": "10Y Treasury", "unit": "%", "group": "Rates", "description": "Nominal 10-year Treasury yield"},
    "DFII10": {"label": "10Y Real Yield", "unit": "%", "group": "Rates", "description": "10-year inflation-indexed Treasury yield"},
    "T10YIE": {"label": "10Y Breakeven", "unit": "%", "group": "Inflation", "description": "10-year market-implied inflation expectation"},
    "FEDFUNDS": {"label": "Fed Funds", "unit": "%", "group": "Rates", "description": "Effective federal funds rate"},
    "UNRATE": {"label": "Unemployment", "unit": "%", "group": "Labor", "description": "US unemployment rate"},
    "BAMLH0A0HYM2": {"label": "High Yield OAS", "unit": "%", "group": "Credit", "description": "US high-yield option-adjusted spread"},
    "DTWEXBGS": {"label": "Broad Dollar Index", "unit": "index", "group": "FX", "description": "Trade-weighted broad US dollar index"},
    "WALCL": {"label": "Fed Balance Sheet", "unit": "$ millions", "group": "Liquidity", "description": "Federal Reserve total assets"},
}

_CACHE: dict[str, Any] = {"expires": 0.0, "payload": None}
CACHE_SECONDS = 15 * 60


class FredError(RuntimeError):
    pass


def _api_key() -> str:
    key = os.getenv("FRED_API_KEY", "").strip()
    if not key:
        raise FredError("FRED_API_KEY is not configured")
    return key


def _fetch_series(series_id: str, observation_start: str) -> dict:
    response = requests.get(
        FRED_BASE,
        params={
            "series_id": series_id,
            "api_key": _api_key(),
            "file_type": "json",
            "observation_start": observation_start,
            "sort_order": "asc",
        },
        timeout=20,
    )
    response.raise_for_status()
    raw = response.json()

    observations = []
    for row in raw.get("observations", []):
        value = row.get("value")
        if value in (None, "."):
            continue
        try:
            observations.append(
                {"date": row["date"], "value": float(value)}
            )
        except (TypeError, ValueError):
            continue

    return {
        "id": series_id,
        **SERIES[series_id],
        "latest": observations[-1] if observations else None,
        "history": observations,
    }


def get_macro_dashboard(observation_start: str = "2021-01-01") -> dict:
    now = time.time()
    if _CACHE["payload"] is not None and now < _CACHE["expires"]:
        return _CACHE["payload"]

    output = []
    errors = {}

    for series_id in SERIES:
        try:
            output.append(_fetch_series(series_id, observation_start))
        except Exception as exc:
            errors[series_id] = str(exc)

    payload = {
        "series": output,
        "errors": errors,
        "source": "Federal Reserve Economic Data (FRED)",
    }
    _CACHE["payload"] = payload
    _CACHE["expires"] = now + CACHE_SECONDS
    return payload
