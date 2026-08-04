from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import StockResponse
from app.services.market_data import MarketDataError, get_stock

app = FastAPI(
    title="Young Bull Market API",
    version="0.1.0",
    description="Market-data API for the Young Bull research platform.",
)

origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "Young Bull Market API", "status": "online"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/stocks/{ticker}", response_model=StockResponse)
def stock_detail(ticker: str) -> StockResponse:
    try:
        return get_stock(ticker)
    except MarketDataError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
