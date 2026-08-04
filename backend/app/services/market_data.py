from __future__ import annotations

import math
from functools import lru_cache
from time import time
from typing import Any
from urllib.parse import quote_plus

import yfinance as yf

from app.models import Company, Fundamentals, HistoryPoint, Quote, RelevantFiles, StockResponse, Technicals

class MarketDataError(RuntimeError):
    pass

def _number(value: Any) -> float | None:
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (TypeError, ValueError):
        return None

def _integer(value: Any) -> int | None:
    number = _number(value)
    return int(number) if number is not None else None

def _return(closes, days: int) -> float | None:
    if len(closes) <= days:
        return None
    start = _number(closes.iloc[-days - 1])
    end = _number(closes.iloc[-1])
    if not start or end is None:
        return None
    return (end / start - 1) * 100

@lru_cache(maxsize=256)
def _cached_stock(ticker: str, cache_bucket: int) -> StockResponse:
    del cache_bucket
    symbol = ticker.upper().strip()
    if not symbol or len(symbol) > 12:
        raise MarketDataError("Invalid ticker")

    try:
        stock = yf.Ticker(symbol)
        history = stock.history(period="1y", interval="1d", auto_adjust=True, timeout=20)
        if history.empty or "Close" not in history.columns:
            raise MarketDataError(f"No price history found for {symbol}")

        try:
            info = stock.info or {}
        except Exception:
            info = {}

        closes = history["Close"].dropna()
        price = _number(closes.iloc[-1])
        previous_close = _number(closes.iloc[-2]) if len(closes) > 1 else None
        change = price - previous_close if price is not None and previous_close is not None else None
        change_percent = change / previous_close * 100 if change is not None and previous_close else None

        points = [HistoryPoint(date=index.strftime("%Y-%m-%d"), close=round(float(close), 2)) for index, close in closes.items()]
        year_high = _number(closes.max())
        year_low = _number(closes.min())

        quote = Quote(
            price=price, previous_close=previous_close, change=change, change_percent=change_percent,
            currency=str(info.get("currency") or "USD"),
            volume=_integer(history["Volume"].dropna().iloc[-1]) if "Volume" in history and not history["Volume"].dropna().empty else None,
            year_high=year_high, year_low=year_low,
        )

        company = Company(
            name=str(info.get("longName") or info.get("shortName") or symbol),
            sector=str(info.get("sector") or "N/A"), industry=str(info.get("industry") or "N/A"),
            exchange=str(info.get("exchange") or info.get("fullExchangeName") or "N/A"),
            country=str(info.get("country") or "N/A"), website=str(info.get("website") or ""),
            employees=_integer(info.get("fullTimeEmployees")), market_cap=_integer(info.get("marketCap")),
            description=str(info.get("longBusinessSummary") or ""),
        )

        fundamentals = Fundamentals(
            trailing_pe=_number(info.get("trailingPE")), forward_pe=_number(info.get("forwardPE")),
            price_to_sales=_number(info.get("priceToSalesTrailing12Months")),
            enterprise_to_ebitda=_number(info.get("enterpriseToEbitda")),
            revenue_growth=_number(info.get("revenueGrowth")), earnings_growth=_number(info.get("earningsGrowth")),
            gross_margin=_number(info.get("grossMargins")), operating_margin=_number(info.get("operatingMargins")),
            profit_margin=_number(info.get("profitMargins")), return_on_equity=_number(info.get("returnOnEquity")),
            free_cash_flow=_integer(info.get("freeCashflow")), total_debt=_integer(info.get("totalDebt")),
        )

        sma_50 = _number(closes.tail(50).mean()) if len(closes) >= 50 else None
        sma_200 = _number(closes.tail(200).mean()) if len(closes) >= 200 else None
        distance_from_high = ((price / year_high) - 1) * 100 if price is not None and year_high else None

        technicals = Technicals(
            return_20d=_return(closes, 20), return_60d=_return(closes, 60), return_200d=_return(closes, 200),
            distance_from_high=distance_from_high, sma_50=sma_50, sma_200=sma_200,
        )

        files = RelevantFiles(
            sec_company=f"https://www.sec.gov/edgar/search/#/q={quote_plus(symbol)}",
            yahoo_profile=f"https://finance.yahoo.com/quote/{quote_plus(symbol)}/profile/",
        )

        return StockResponse(ticker=symbol, quote=quote, company=company, fundamentals=fundamentals, technicals=technicals, files=files, history=points)
    except MarketDataError:
        raise
    except Exception as exc:
        print(f"Yahoo Finance error for {symbol}: {repr(exc)}")
        raise MarketDataError(f"Unable to retrieve market data for {symbol}") from exc

def get_stock(ticker: str) -> StockResponse:
    return _cached_stock(ticker, int(time() // 300))
