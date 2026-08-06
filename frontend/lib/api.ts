import type { ComparisonResponse, PortfolioSnapshot, PremiumWorkbook, StockResponse, StoredScore } from "./types";

const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body}`);
  }
  return response.json();
}

export function getStock(ticker: string) {
  return request<StockResponse>(`/api/stocks/${encodeURIComponent(ticker.toUpperCase())}`);
}

export async function getScore(ticker: string): Promise<StoredScore | null> {
  try {
    return await request<StoredScore>(`/api/stocks/${encodeURIComponent(ticker.toUpperCase())}/score`);
  } catch {
    return null;
  }
}

export async function getPremiumWorkbook(ticker: string): Promise<PremiumWorkbook | null> {
  try {
    return await request<PremiumWorkbook>(`/api/stocks/${encodeURIComponent(ticker.toUpperCase())}/premium`);
  } catch {
    return null;
  }
}

export async function getUniverseScores() {
  return request<{ as_of: string | null; stocks: any[] }>("/api/universe?limit=150");
}

export function getPortfolio(){return request<PortfolioSnapshot>("/api/portfolio");}
export function getComparison(ticker:string){return request<ComparisonResponse>(`/api/stocks/${encodeURIComponent(ticker.toUpperCase())}/comparison`);}
