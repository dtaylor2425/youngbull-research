from __future__ import annotations

import os
from datetime import date

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc, func, select

from app.db import init_db, session_scope
from app.models import StockResponse
from app.services.alpha_vantage import AlphaVantageError, build_premium_workbook
from app.services.market_data import MarketDataError, get_stock
from app.tables import StockScore

app = FastAPI(title="Young Bull Market API", version="2.0.0")

origins = [x.strip() for x in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",") if x.strip()]
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
    return {"status": "ok", "version": "2.0.0"}

@app.get("/api/stocks/{ticker}", response_model=StockResponse)
def stock_detail(ticker: str) -> StockResponse:
    try:
        return get_stock(ticker)
    except MarketDataError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

@app.get("/api/universe")
def universe_scores(limit: int = Query(100, ge=1, le=500)) -> dict:
    with session_scope() as session:
        latest = session.scalar(select(func.max(StockScore.as_of)))
        if latest is None:
            return {"as_of": None, "stocks": [], "message": "Run the scoring refresh job first."}
        rows = session.scalars(
            select(StockScore)
            .where(StockScore.as_of == latest)
            .order_by(desc(StockScore.overall_score))
            .limit(limit)
        ).all()
        return {
            "as_of": latest.isoformat(),
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
            raise HTTPException(status_code=404, detail="No stored score. Run refresh_scores first.")
        return {
            "ticker": row.ticker,
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
