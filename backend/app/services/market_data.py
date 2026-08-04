from __future__ import annotations

import math
from functools import lru_cache
from time import time
from typing import Any

import yfinance as yf

from app.models import Company, HistoryPoint, Quote, StockResponse


class MarketDataError(RuntimeError):
    pass


def _clean_number(value: Any) -> float | None:
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (TypeError, ValueError):
        return None


def _clean_int(value: Any) -> int | None:
    number = _clean_number(value)
    return int(number) if number is not None else None


@lru_cache(maxsize=256)
def _cached_stock(ticker: str, cache_bucket: int) -> StockResponse:
    del cache_bucket

    symbol = ticker.upper().strip()
    if not symbol or len(symbol) > 12:
        raise MarketDataError("Invalid ticker")

    stock = yf.Ticker(symbol)

    try:
        history = stock.history(period="1y", interval="1d", auto_adjust=True)
        if history.empty:
            raise MarketDataError(f"No market data found for {symbol}")

        info = stock.get_info()
        fast = stock.fast_info

        close = _clean_number(history["Close"].iloc[-1])
        previous_close = (
            _clean_number(history["Close"].iloc[-2])
            if len(history.index) > 1
            else _clean_number(fast.get("previous_close"))
        )

        change = (
            close - previous_close
            if close is not None and previous_close is not None
            else None
        )
        change_percent = (
            (change / previous_close) * 100
            if change is not None and previous_close
            else None
        )

        points = [
            HistoryPoint(
                date=index.strftime("%Y-%m-%d"),
                close=round(float(row["Close"]), 2),
            )
            for index, row in history.iterrows()
            if _clean_number(row["Close"]) is not None
        ]

        quote = Quote(
            price=close,
            previous_close=previous_close,
            change=change,
            change_percent=change_percent,
            currency=str(info.get("currency") or "USD"),
            volume=_clean_int(info.get("volume") or fast.get("last_volume")),
            year_high=_clean_number(info.get("fiftyTwoWeekHigh") or fast.get("year_high")),
            year_low=_clean_number(info.get("fiftyTwoWeekLow") or fast.get("year_low")),
        )

        company = Company(
            name=str(info.get("longName") or info.get("shortName") or symbol),
            sector=str(info.get("sector") or "N/A"),
            industry=str(info.get("industry") or "N/A"),
            exchange=str(info.get("exchange") or "N/A"),
            country=str(info.get("country") or "N/A"),
            website=str(info.get("website") or ""),
            employees=_clean_int(info.get("fullTimeEmployees")),
            market_cap=_clean_int(info.get("marketCap") or fast.get("market_cap")),
            description=str(info.get("longBusinessSummary") or ""),
        )

        return StockResponse(
            ticker=symbol,
            quote=quote,
            company=company,
            history=points,
        )
    except MarketDataError:
        raise
    except Exception as exc:
        raise MarketDataError(f"Unable to retrieve {symbol}") from exc


def get_stock(ticker: str) -> StockResponse:
    # Five-minute cache without adding Redis during the MVP.
    cache_bucket = int(time() // 300)
    return _cached_stock(ticker, cache_bucket)
