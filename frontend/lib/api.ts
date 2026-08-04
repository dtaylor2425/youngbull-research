import type { StockResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getStock(ticker: string): Promise<StockResponse> {
  const response = await fetch(`${API_URL}/api/stocks/${ticker}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Unable to load ${ticker}`);
  }

  return response.json();
}
