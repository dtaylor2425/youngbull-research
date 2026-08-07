from __future__ import annotations

import os
import time
import requests

FRED_BASE = "https://api.stlouisfed.org/fred/series/observations"

SERIES = {
    "DGS10": ("10Y Treasury", "%", "Rates", "Nominal 10-year Treasury yield"),
    "DFII10": ("10Y Real Yield", "%", "Rates", "10-year inflation-indexed Treasury yield"),
    "T10YIE": ("10Y Breakeven", "%", "Inflation", "10-year market-implied inflation expectation"),
    "FEDFUNDS": ("Fed Funds", "%", "Rates", "Effective federal funds rate"),
    "UNRATE": ("Unemployment", "%", "Labor", "US unemployment rate"),
    "BAMLH0A0HYM2": ("High Yield OAS", "%", "Credit", "US high-yield option-adjusted spread"),
    "DTWEXBGS": ("Broad Dollar Index", "index", "FX", "Trade-weighted broad US dollar index"),
    "WALCL": ("Fed Balance Sheet", "$ millions", "Liquidity", "Federal Reserve total assets"),
}

_CACHE = {"expires": 0.0, "payload": None}
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
    rows = []
    for row in response.json().get("observations", []):
        value = row.get("value")
        if value in (None, "."):
            continue
        try:
            rows.append({"date": row["date"], "value": float(value)})
        except (TypeError, ValueError):
            continue
    label, unit, group, description = SERIES[series_id]
    return {
        "id": series_id,
        "label": label,
        "unit": unit,
        "group": group,
        "description": description,
        "latest": rows[-1] if rows else None,
        "history": rows,
    }

def get_macro_dashboard(observation_start: str = "2021-01-01") -> dict:
    now = time.time()
    if _CACHE["payload"] is not None and now < _CACHE["expires"]:
        return _CACHE["payload"]
    series = []
    errors = {}
    for series_id in SERIES:
        try:
            series.append(_fetch_series(series_id, observation_start))
        except Exception as exc:
            errors[series_id] = str(exc)
    payload = {"series": series, "errors": errors, "source": "Federal Reserve Economic Data (FRED)"}
    _CACHE["payload"] = payload
    _CACHE["expires"] = now + CACHE_SECONDS
    return payload
