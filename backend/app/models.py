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

class Fundamentals(BaseModel):
    trailing_pe: float | None = None
    forward_pe: float | None = None
    price_to_sales: float | None = None
    enterprise_to_ebitda: float | None = None
    revenue_growth: float | None = None
    earnings_growth: float | None = None
    gross_margin: float | None = None
    operating_margin: float | None = None
    profit_margin: float | None = None
    return_on_equity: float | None = None
    free_cash_flow: int | None = None
    total_debt: int | None = None

class Technicals(BaseModel):
    return_20d: float | None = None
    return_60d: float | None = None
    return_200d: float | None = None
    distance_from_high: float | None = None
    sma_50: float | None = None
    sma_200: float | None = None

class RelevantFiles(BaseModel):
    sec_company: str
    yahoo_profile: str

class HistoryPoint(BaseModel):
    date: str
    close: float

class StockResponse(BaseModel):
    ticker: str
    quote: Quote
    company: Company
    fundamentals: Fundamentals
    technicals: Technicals
    files: RelevantFiles
    history: list[HistoryPoint]
