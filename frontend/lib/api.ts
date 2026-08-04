import type { StockResponse } from "./types";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getStock(ticker: string): Promise<StockResponse> {
  const baseUrl = API_URL.replace(/\/$/, "");
  const symbol = ticker.trim().toUpperCase();
  const url = `${baseUrl}/api/stocks/${encodeURIComponent(symbol)}`;

  console.log(`[Young Bull API] Requesting: ${url}`);

  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Stock API returned ${response.status}: ${body}`);
  }

  return response.json();
}
