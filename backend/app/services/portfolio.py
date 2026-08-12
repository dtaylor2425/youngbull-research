from __future__ import annotations
from datetime import datetime, timezone
import math
import yfinance as yf
from app.portfolio_data import PORTFOLIO_HOLDINGS

def safe(v):
    try:
        n = float(v)
        return n if math.isfinite(n) else None
    except (TypeError, ValueError):
        return None

def get_live_portfolio():
    tickers = [x["ticker"].upper() for x in PORTFOLIO_HOLDINGS]
    frame = yf.download(tickers, period="7d", interval="1d", auto_adjust=True,
                        progress=False, group_by="ticker", threads=True)

    rows = []
    total_now = total_prev = total_cost = 0.0
    priced = day_priced = 0

    for src in PORTFOLIO_HOLDINGS:
        ticker = src["ticker"].upper()
        try:
            closes = frame[ticker]["Close"].dropna() if len(tickers) > 1 else frame["Close"].dropna()
        except Exception:
            closes = []

        latest = safe(closes.iloc[-1]) if len(closes) >= 1 else None
        previous = safe(closes.iloc[-2]) if len(closes) >= 2 else None
        avg_cost = safe(src.get("average_cost"))
        shares = safe(src.get("shares"))
        stored_cost = safe(src.get("total_cost"))

        if shares is None and stored_cost is not None and avg_cost:
            shares = stored_cost / avg_cost

        current_value = shares * latest if shares is not None and latest is not None else None
        previous_value = shares * previous if shares is not None and previous is not None else None
        total_return = ((latest / avg_cost) - 1) * 100 if latest is not None and avg_cost not in (None, 0) else None
        day_return = ((latest / previous) - 1) * 100 if latest is not None and previous not in (None, 0) else None

        if current_value is not None:
            total_now += current_value
            priced += 1
        if previous_value is not None:
            total_prev += previous_value
            day_priced += 1
        if stored_cost is not None and current_value is not None:
            total_cost += stored_cost

        rows.append({
            "ticker": ticker,
            "acquired": src.get("acquired"),
            "_current_value": current_value,
            "day_gain_pct": day_return,
            "total_gain_pct": total_return,
            "data_status": "live" if latest is not None else "unavailable",
        })

    holdings = []
    for row in rows:
        current_value = row.pop("_current_value")
        row["weight"] = (current_value / total_now * 100) if current_value is not None and total_now > 0 else None
        row["day_gain_pct"] = round(row["day_gain_pct"], 2) if row["day_gain_pct"] is not None else None
        row["total_gain_pct"] = round(row["total_gain_pct"], 2) if row["total_gain_pct"] is not None else None
        row["weight"] = round(row["weight"], 2) if row["weight"] is not None else None
        holdings.append(row)

    total_return_pct = ((total_now / total_cost) - 1) * 100 if total_now > 0 and total_cost > 0 else None
    day_return_pct = ((total_now / total_prev) - 1) * 100 if total_now > 0 and total_prev > 0 else None

    valid = [h for h in holdings if h["total_gain_pct"] is not None]
    winners = sum(1 for h in valid if h["total_gain_pct"] >= 0)
    best = max(valid, key=lambda h: h["total_gain_pct"]) if valid else None
    worst = min(valid, key=lambda h: h["total_gain_pct"]) if valid else None

    return {
        "as_of": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "holdings": len(holdings),
            "priced_holdings": priced,
            "day_priced_holdings": day_priced,
            "coverage_pct": round(priced / len(holdings) * 100, 1) if holdings else 0.0,
            "day_coverage_pct": round(day_priced / len(holdings) * 100, 1) if holdings else 0.0,
            "day_return_pct": round(day_return_pct, 2) if day_return_pct is not None else None,
            "total_return_pct": round(total_return_pct, 2) if total_return_pct is not None else None,
            "winning_positions": winners,
            "best_position": {"ticker": best["ticker"], "return_pct": best["total_gain_pct"]} if best else None,
            "worst_position": {"ticker": worst["ticker"], "return_pct": worst["total_gain_pct"]} if worst else None,
        },
        "holdings": holdings,
    }
