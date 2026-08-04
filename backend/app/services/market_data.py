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

    try:
        stock = yf.Ticker(symbol)

        history = stock.history(
            period="1y",
            interval="1d",
            auto_adjust=True,
            timeout=20,
        )

        if history.empty or "Close" not in history.columns:
            raise MarketDataError(f"No price history found for {symbol}")

        try:
            info = stock.info or {}
        except Exception:
            info = {}

        closes = history["Close"].dropna()

        if closes.empty:
            raise MarketDataError(f"No closing prices found for {symbol}")

        price = _clean_number(closes.iloc[-1])
        previous_close = (
            _clean_number(closes.iloc[-2])
            if len(closes) > 1
            else None
        )

        change = None
        change_percent = None

        if price is not None and previous_close is not None:
            change = price - previous_close

            if previous_close != 0:
                change_percent = change / previous_close * 100

        history_points = [
            HistoryPoint(
                date=index.strftime("%Y-%m-%d"),
                close=round(float(close), 2),
            )
            for index, close in closes.items()
        ]

        quote = Quote(
            price=price,
            previous_close=previous_close,
            change=change,
            change_percent=change_percent,
            currency=str(info.get("currency") or "USD"),
            volume=_clean_int(
                history["Volume"].dropna().iloc[-1]
                if "Volume" in history.columns
                and not history["Volume"].dropna().empty
                else None
            ),
            year_high=_clean_number(closes.max()),
            year_low=_clean_number(closes.min()),
        )

        company = Company(
            name=str(
                info.get("longName")
                or info.get("shortName")
                or symbol
            ),
            sector=str(info.get("sector") or "N/A"),
            industry=str(info.get("industry") or "N/A"),
            exchange=str(
                info.get("exchange")
                or info.get("fullExchangeName")
                or "N/A"
            ),
            country=str(info.get("country") or "N/A"),
            website=str(info.get("website") or ""),
            employees=_clean_int(info.get("fullTimeEmployees")),
            market_cap=_clean_int(info.get("marketCap")),
            description=str(info.get("longBusinessSummary") or ""),
        )

        return StockResponse(
            ticker=symbol,
            quote=quote,
            company=company,
            history=history_points,
        )

    except MarketDataError:
        raise
    except Exception as exc:
        print(f"Yahoo Finance error for {symbol}: {repr(exc)}")
        raise MarketDataError(
            f"Unable to retrieve market data for {symbol}"
        ) from exc


def get_stock(ticker: str) -> StockResponse:
    cache_bucket = int(time() // 300)
    return _cached_stock(ticker, cache_bucket)