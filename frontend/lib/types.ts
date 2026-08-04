export type HistoryPoint = {
  date: string;
  close: number;
};

export type StockResponse = {
  ticker: string;
  quote: {
    price: number | null;
    previous_close: number | null;
    change: number | null;
    change_percent: number | null;
    currency: string;
    volume: number | null;
    year_high: number | null;
    year_low: number | null;
  };
  company: {
    name: string;
    sector: string;
    industry: string;
    exchange: string;
    country: string;
    website: string;
    employees: number | null;
    market_cap: number | null;
    description: string;
  };
  history: HistoryPoint[];
};
