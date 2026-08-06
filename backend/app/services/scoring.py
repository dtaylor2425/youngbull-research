from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any

import numpy as np
import pandas as pd
import yfinance as yf

from app.universe import THEMATIC_FIT

@dataclass
class RawStock:
    ticker: str
    company: str
    price: float | None
    market_cap: float | None
    theme: str
    thematic_score: float
    metrics: dict[str, float | None]

def _safe(value: Any) -> float | None:
    try:
        number = float(value)
        return number if np.isfinite(number) else None
    except (TypeError, ValueError):
        return None

def _return(close: pd.Series, days: int) -> float | None:
    if len(close) <= days:
        return None
    start, end = _safe(close.iloc[-days - 1]), _safe(close.iloc[-1])
    return ((end / start) - 1) if start and end is not None else None

def _rsi(close: pd.Series, period: int = 14) -> float | None:
    if len(close) <= period:
        return None
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = -delta.clip(upper=0).rolling(period).mean()
    rs = gain / loss.replace(0, np.nan)
    return _safe((100 - (100 / (1 + rs))).iloc[-1])

def collect_raw(ticker: str) -> RawStock:
    stock = yf.Ticker(ticker)
    history = stock.history(period="2y", interval="1d", auto_adjust=True)
    if history.empty:
        raise RuntimeError(f"No history for {ticker}")

    close = history["Close"].dropna()
    volume = history["Volume"].dropna()
    try:
        info = stock.info or {}
    except Exception:
        info = {}

    sma20 = _safe(close.tail(20).mean())
    sma50 = _safe(close.tail(50).mean())
    sma200 = _safe(close.tail(200).mean())
    price = _safe(close.iloc[-1])
    high52 = _safe(close.tail(252).max())
    vol20 = _safe(volume.tail(20).mean()) if not volume.empty else None
    current_vol = _safe(volume.iloc[-1]) if not volume.empty else None

    theme, thematic = THEMATIC_FIT.get(ticker, ("Unclassified", 50))
    metrics = {
        "return_20d": _return(close, 20),
        "return_60d": _return(close, 60),
        "return_126d": _return(close, 126),
        "return_252d": _return(close, 252),
        "distance_from_high": (price / high52 - 1) if price and high52 else None,
        "above_sma20": (price / sma20 - 1) if price and sma20 else None,
        "above_sma50": (price / sma50 - 1) if price and sma50 else None,
        "above_sma200": (price / sma200 - 1) if price and sma200 else None,
        "sma50_above_200": (sma50 / sma200 - 1) if sma50 and sma200 else None,
        "relative_volume": (current_vol / vol20) if current_vol and vol20 else None,
        "rsi14": _rsi(close),
        "revenue_growth": _safe(info.get("revenueGrowth")),
        "earnings_growth": _safe(info.get("earningsGrowth")),
        "gross_margin": _safe(info.get("grossMargins")),
        "operating_margin": _safe(info.get("operatingMargins")),
        "profit_margin": _safe(info.get("profitMargins")),
        "return_on_equity": _safe(info.get("returnOnEquity")),
        "debt_to_equity": _safe(info.get("debtToEquity")),
        "free_cash_flow": _safe(info.get("freeCashflow")),
        "market_cap": _safe(info.get("marketCap")),
    }
    return RawStock(
        ticker=ticker,
        company=str(info.get("longName") or info.get("shortName") or ticker),
        price=price,
        market_cap=_safe(info.get("marketCap")),
        theme=theme,
        thematic_score=float(thematic),
        metrics=metrics,
    )

def _percentile(series: pd.Series, higher_is_better: bool = True) -> pd.Series:
    numeric = pd.to_numeric(series, errors="coerce")
    ranked = numeric.rank(pct=True, method="average") * 100
    if not higher_is_better:
        ranked = 100 - ranked
    return ranked.fillna(50)

def score_universe(raw: list[RawStock]) -> list[dict]:
    frame = pd.DataFrame([{"ticker": x.ticker, **x.metrics} for x in raw]).set_index("ticker")

    momentum_parts = [
        _percentile(frame["return_20d"]),
        _percentile(frame["return_60d"]),
        _percentile(frame["return_126d"]),
        _percentile(frame["return_252d"]),
    ]
    technical_parts = [
        _percentile(frame["above_sma20"]),
        _percentile(frame["above_sma50"]),
        _percentile(frame["above_sma200"]),
        _percentile(frame["sma50_above_200"]),
        _percentile(frame["distance_from_high"]),
    ]
    fundamental_parts = [
        _percentile(frame["revenue_growth"]),
        _percentile(frame["earnings_growth"]),
        _percentile(frame["gross_margin"]),
        _percentile(frame["operating_margin"]),
        _percentile(frame["profit_margin"]),
        _percentile(frame["return_on_equity"]),
        _percentile(frame["debt_to_equity"], higher_is_better=False),
    ]

    momentum = pd.concat(momentum_parts, axis=1).mean(axis=1)
    technical = pd.concat(technical_parts, axis=1).mean(axis=1)
    fundamental = pd.concat(fundamental_parts, axis=1).mean(axis=1)

    output = []
    lookup = {x.ticker: x for x in raw}
    for ticker in frame.index:
        item = lookup[ticker]
        overall = (
            momentum[ticker] * 0.25
            + technical[ticker] * 0.25
            + fundamental[ticker] * 0.30
            + item.thematic_score * 0.20
        )
        output.append({
            "ticker": ticker,
            "company": item.company,
            "theme": item.theme,
            "as_of": date.today(),
            "price": item.price,
            "market_cap": item.market_cap,
            "momentum_score": round(float(momentum[ticker]), 1),
            "technical_score": round(float(technical[ticker]), 1),
            "fundamental_score": round(float(fundamental[ticker]), 1),
            "thematic_score": round(item.thematic_score, 1),
            "overall_score": round(float(overall), 1),
            "raw_metrics": item.metrics,
        })
    return sorted(output, key=lambda x: x["overall_score"], reverse=True)
