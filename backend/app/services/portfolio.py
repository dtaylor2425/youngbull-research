from __future__ import annotations

from datetime import datetime, timezone
import math
from typing import Any

import yfinance as yf

from app.portfolio_data import PORTFOLIO_HOLDINGS


def _safe(value: Any) -> float | None:
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (TypeError, ValueError):
        return None


def _recent_closes(tickers: list[str]) -> dict[str, tuple[float | None, float | None]]:
    if not tickers:
        return {}

    frame = yf.download(
        tickers,
        period="7d",
        interval="1d",
        auto_adjust=True,
        progress=False,
        group_by="ticker",
        threads=True,
    )

    result: dict[str, tuple[float | None, float | None]] = {}

    for ticker in tickers:
        latest = None
        previous = None

        try:
            if len(tickers) == 1:
                closes = frame["Close"].dropna()
            else:
                closes = frame[ticker]["Close"].dropna()

            if len(closes) >= 1:
                latest = _safe(closes.iloc[-1])
            if len(closes) >= 2:
                previous = _safe(closes.iloc[-2])
        except Exception:
            pass

        result[ticker] = (latest, previous)

    return result


def get_live_portfolio() -> dict:
    tickers = [row["ticker"].upper() for row in PORTFOLIO_HOLDINGS]
    prices = _recent_closes(tickers)

    private_rows: list[dict] = []
    total_current_value = 0.0
    total_previous_value = 0.0
    total_cost = 0.0
    priced_holdings = 0
    day_priced_holdings = 0

    for source in PORTFOLIO_HOLDINGS:
        ticker = source["ticker"].upper()
        latest, previous = prices.get(ticker, (None, None))

        average_cost = _safe(source.get("average_cost"))
        shares = _safe(source.get("shares"))
        stored_cost = _safe(source.get("total_cost"))

        if shares is None and stored_cost is not None and average_cost not in (None, 0):
            shares = stored_cost / average_cost

        current_value = (
            shares * latest
            if shares is not None and latest is not None
            else None
        )
        previous_value = (
            shares * previous
            if shares is not None and previous is not None
            else None
        )

        day_return_pct = (
            ((latest / previous) - 1.0) * 100.0
            if latest is not None and previous not in (None, 0)
            else None
        )

        total_return_pct = (
            ((latest / average_cost) - 1.0) * 100.0
            if latest is not None and average_cost not in (None, 0)
            else None
        )

        if current_value is not None:
            total_current_value += current_value
            priced_holdings += 1

        if previous_value is not None:
            total_previous_value += previous_value
            day_priced_holdings += 1

        if current_value is not None and stored_cost is not None:
            total_cost += stored_cost

        private_rows.append(
            {
                "ticker": ticker,
                "acquired": str(source.get("acquired") or ""),
                "_current_value": current_value,
                "day_gain_pct": day_return_pct,
                "total_gain_pct": total_return_pct,
                "data_status": "live" if latest is not None else "unavailable",
            }
        )

    holdings: list[dict] = []

    for row in private_rows:
        current_value = row.pop("_current_value")

        weight = (
            current_value / total_current_value * 100.0
            if current_value is not None and total_current_value > 0
            else None
        )

        holdings.append(
            {
                **row,
                "weight": round(weight, 2) if weight is not None else None,
                "day_gain_pct": (
                    round(row["day_gain_pct"], 2)
                    if row["day_gain_pct"] is not None
                    else None
                ),
                "total_gain_pct": (
                    round(row["total_gain_pct"], 2)
                    if row["total_gain_pct"] is not None
                    else None
                ),
            }
        )

    portfolio_total_return = (
        ((total_current_value / total_cost) - 1.0) * 100.0
        if total_current_value > 0 and total_cost > 0
        else None
    )

    portfolio_day_return = (
        ((total_current_value / total_previous_value) - 1.0) * 100.0
        if total_current_value > 0 and total_previous_value > 0
        else None
    )

    valid_returns = [
        holding
        for holding in holdings
        if holding["total_gain_pct"] is not None
    ]

    winners = sum(
        1 for holding in valid_returns if holding["total_gain_pct"] >= 0
    )

    best = (
        max(valid_returns, key=lambda holding: holding["total_gain_pct"])
        if valid_returns
        else None
    )
    worst = (
        min(valid_returns, key=lambda holding: holding["total_gain_pct"])
        if valid_returns
        else None
    )

    count = len(holdings)

    return {
        "as_of": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "holdings": count,
            "priced_holdings": priced_holdings,
            "day_priced_holdings": day_priced_holdings,
            "coverage_pct": (
                round(priced_holdings / count * 100.0, 1) if count else 0.0
            ),
            "day_coverage_pct": (
                round(day_priced_holdings / count * 100.0, 1)
                if count
                else 0.0
            ),
            "day_return_pct": (
                round(portfolio_day_return, 2)
                if portfolio_day_return is not None
                else None
            ),
            "total_return_pct": (
                round(portfolio_total_return, 2)
                if portfolio_total_return is not None
                else None
            ),
            "winning_positions": winners,
            "best_position": (
                {
                    "ticker": best["ticker"],
                    "return_pct": best["total_gain_pct"],
                }
                if best
                else None
            ),
            "worst_position": (
                {
                    "ticker": worst["ticker"],
                    "return_pct": worst["total_gain_pct"],
                }
                if worst
                else None
            ),
        },
        "holdings": holdings,
    }
