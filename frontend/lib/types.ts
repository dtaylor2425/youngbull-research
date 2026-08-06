export type HistoryPoint = { date: string; close: number };

export type StockResponse = {
  ticker: string;
  quote: {
    price: number | null; previous_close: number | null; change: number | null;
    change_percent: number | null; currency: string; volume: number | null;
    year_high: number | null; year_low: number | null;
  };
  company: {
    name: string; sector: string; industry: string; exchange: string; country: string;
    website: string; employees: number | null; market_cap: number | null; description: string;
  };
  fundamentals: {
    trailing_pe: number | null; forward_pe: number | null; price_to_sales: number | null;
    enterprise_to_ebitda: number | null; revenue_growth: number | null; earnings_growth: number | null;
    gross_margin: number | null; operating_margin: number | null; profit_margin: number | null;
    return_on_equity: number | null; free_cash_flow: number | null; total_debt: number | null;
  };
  technicals: {
    return_20d: number | null; return_60d: number | null; return_200d: number | null;
    distance_from_high: number | null; sma_50: number | null; sma_200: number | null;
  };
  files: { sec_company: string; yahoo_profile: string };
  history: HistoryPoint[];
};

export type StoredScore = {
  ticker: string; company?: string; theme?: string; as_of: string; momentum: number; technicals: number;
  fundamentals: number; thematic_fit: number; overall: number;
  raw_metrics: Record<string, number | null>;
};

export type PremiumWorkbook = {
  ticker: string;
  datasets: {
    overview: Record<string, string>;
    income: { quarterlyReports?: Record<string, string>[]; annualReports?: Record<string, string>[] };
    balance: { quarterlyReports?: Record<string, string>[]; annualReports?: Record<string, string>[] };
    cashflow: { quarterlyReports?: Record<string, string>[]; annualReports?: Record<string, string>[] };
    earnings: { quarterlyEarnings?: Record<string, string>[]; annualEarnings?: Record<string, string>[] };
    estimates: Record<string, unknown>;
  };
  errors: Record<string, string>;
};

export type PortfolioHolding={ticker:string;day_gain:number;day_gain_pct:number;total_gain:number;total_gain_pct:number;last_price:number;average_cost:number;weight:number;acquired:string;total_cost:number;shares:number;market_value:number};
export type PortfolioSnapshot={as_of:string;summary:{holdings:number;total_cost:number;market_value:number;total_gain:number;total_return_pct:number;day_gain:number;invested_weight_pct:number};holdings:PortfolioHolding[]};
export type ComparisonResponse={ticker:string;series:Record<string,{date:string;value:number}[]>};
