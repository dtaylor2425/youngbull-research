import type { StockResponse } from "./types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export async function getStock(ticker: string): Promise<StockResponse> {
  const symbol = ticker.trim().toUpperCase();
  const url = `${API_URL}/api/stocks/${encodeURIComponent(symbol)}`;

  console.log(`[Young Bull API] Requesting: ${url}`);

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const responseBody = await response.text();

    console.error("[Young Bull API] Request failed", {
      url,
      status: response.status,
      body: responseBody,
    });

    throw new Error(
      `API request failed with status ${response.status}: ${responseBody}`
    );
  }

  const data = (await response.json()) as StockResponse;

  if (!data.ticker || !data.quote || !data.company) {
    console.error("[Young Bull API] Unexpected response:", data);
    throw new Error("The stock API returned an unexpected response.");
  }

  return data;
}