from __future__ import annotations

import os

import yfinance as yf
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc, func, select, text

from app.db import engine, init_db, session_scope
from app.models import StockResponse
from app.services.alpha_vantage import AlphaVantageError, build_premium_workbook
from app.services.fred import FredError, get_macro_dashboard
from app.services.market_data import MarketDataError, get_stock
from app.services.portfolio import get_live_portfolio
from app.tables import StockScore

app = FastAPI(title="Young Bull Market API", version="3.0.0")

origins = [
    value.strip()
    for value in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000",
    ).split(",")
    if value.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "version": "3.0.0"}


@app.get("/db-check")
def db_check() -> dict:
    result = {
        "dialect": engine.dialect.name,
        "driver": engine.dialect.driver,
    }

    if engine.dialect.name == "postgresql":
        with engine.connect() as connection:
            result["database"] = connection.execute(
                text("SELECT current_database()")
            ).scalar()
            result["user"] = connection.execute(
                text("SELECT current_user")
            ).scalar()
            result["version"] = connection.execute(
                text("SELECT version()")
            ).scalar()
    else:
        result["warning"] = "Backend is not connected to PostgreSQL."

    return result


@app.get("/api/stocks/{ticker}", response_model=StockResponse)
def stock_detail(ticker: str) -> StockResponse:
    try:
        return get_stock(ticker)
    except MarketDataError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/universe")
def universe_scores(limit: int = Query(500, ge=1, le=500)) -> dict:
    with session_scope() as session:
        latest = session.scalar(select(func.max(StockScore.as_of)))

        if latest is None:
            return {
                "as_of": None,
                "stocks": [],
                "message": "Run the scoring refresh job first.",
            }

        rows = session.scalars(
            select(StockScore)
            .where(StockScore.as_of == latest)
            .order_by(desc(StockScore.overall_score))
            .limit(limit)
        ).all()

        return {
            "as_of": latest.isoformat(),
            "stored_count": len(rows),
            "stocks": [
                {
                    "ticker": row.ticker,
                    "company": row.company,
                    "theme": row.theme,
                    "price": row.price,
                    "market_cap": row.market_cap,
                    "momentum": row.momentum_score,
                    "technicals": row.technical_score,
                    "fundamentals": row.fundamental_score,
                    "thematic_fit": row.thematic_score,
                    "overall": row.overall_score,
                    "raw_metrics": row.raw_metrics,
                }
                for row in rows
            ],
        }


@app.get("/api/stocks/{ticker}/score")
def ticker_score(ticker: str) -> dict:
    with session_scope() as session:
        row = session.scalar(
            select(StockScore)
            .where(StockScore.ticker == ticker.upper())
            .order_by(desc(StockScore.as_of))
            .limit(1)
        )

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Ticker is not currently in the scored universe.",
            )

        return {
            "ticker": row.ticker,
            "company": row.company,
            "theme": row.theme,
            "as_of": row.as_of.isoformat(),
            "momentum": row.momentum_score,
            "technicals": row.technical_score,
            "fundamentals": row.fundamental_score,
            "thematic_fit": row.thematic_score,
            "overall": row.overall_score,
            "raw_metrics": row.raw_metrics,
        }


@app.get("/api/stocks/{ticker}/premium")
def premium_workbook(ticker: str, refresh: bool = False) -> dict:
    try:
        return build_premium_workbook(ticker, refresh=refresh)
    except AlphaVantageError as exc:
        raise HTTPException(status_code=429, detail=str(exc)) from exc


@app.get("/api/portfolio")
def portfolio_snapshot() -> dict:
    return get_live_portfolio()


@app.get("/api/stocks/{ticker}/comparison")
def stock_comparison(ticker: str, period: str = "2y") -> dict:
    symbols = [ticker.upper(), "SPY", "SMH"]

    frame = yf.download(
        symbols,
        period=period,
        interval="1d",
        auto_adjust=True,
        progress=False,
        group_by="ticker",
        threads=True,
    )

    output = {}

    for symbol in symbols:
        try:
            series = frame[symbol]["Close"].dropna()
        except Exception:
            try:
                series = frame["Close"][symbol].dropna()
            except Exception:
                output[symbol] = []
                continue

        if series.empty:
            output[symbol] = []
            continue

        base_value = float(series.iloc[0])
        output[symbol] = [
            {
                "date": index.strftime("%Y-%m-%d"),
                "value": round(float(value / base_value * 100.0), 2),
            }
            for index, value in series.items()
        ]

    return {"ticker": ticker.upper(), "series": output}


@app.get("/api/macro")
def macro_dashboard() -> dict:
    try:
        return get_macro_dashboard()
    except FredError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
