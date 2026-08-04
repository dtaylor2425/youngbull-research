import type { StockResponse } from "./types";

const API_URL = process.env.API_URL;

export async function getStock(ticker: string): Promise<StockResponse> {
  if (!API_URL) {
    throw new Error(
      "API_URL is missing. Add the Railway backend URL to the Vercel environment variables."
    );
  }

  const symbol = ticker.trim().toUpperCase();
  const baseUrl = API_URL.replace(/\/$/, "");
  const url = `${baseUrl}/api/stocks/${encodeURIComponent(symbol)}`;

  console.log(`[Young Bull API] Requesting: ${url}`);

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const responseBody = await response.text();

    throw new Error(
      `Stock API failed with ${response.status}: ${responseBody}`
    );
  }

  return response.json();
}