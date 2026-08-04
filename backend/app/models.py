from pydantic import BaseModel


class Quote(BaseModel):
    price: float | None = None
    previous_close: float | None = None
    change: float | None = None
    change_percent: float | None = None
    currency: str = "USD"
    volume: int | None = None
    year_high: float | None = None
    year_low: float | None = None


class Company(BaseModel):
    name: str
    sector: str = "N/A"
    industry: str = "N/A"
    exchange: str = "N/A"
    country: str = "N/A"
    website: str = ""
    employees: int | None = None
    market_cap: int | None = None
    description: str = ""


class HistoryPoint(BaseModel):
    date: str
    close: float


class StockResponse(BaseModel):
    ticker: str
    quote: Quote
    company: Company
    history: list[HistoryPoint]
