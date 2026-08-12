"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioHolding } from "@/lib/types";

type SortKey = "weight" | "total_gain_pct" | "day_gain_pct";

function formatPct(value: number | null) {
  if (value == null) return "N/A";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function PortfolioTable({
  holdings,
  compact = false,
}: {
  holdings: PortfolioHolding[];
  compact?: boolean;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("weight");

  const sorted = useMemo(() => {
    return [...holdings].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return bValue - aValue;
    });
  }, [holdings, sortKey]);

  const visible = compact ? sorted.slice(0, 10) : sorted;

  return (
    <div>
      {!compact && (
        <div className="portfolio-sort">
          <span>SORT BY</span>
          <button onClick={() => setSortKey("weight")}>
            Weight
          </button>
          <button onClick={() => setSortKey("total_gain_pct")}>
            Total return
          </button>
          <button onClick={() => setSortKey("day_gain_pct")}>
            Day
          </button>
        </div>
      )}

      <div className="portfolio-table-wrap">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Weight</th>
              <th>Day</th>
              <th>Total return</th>
              <th>Acquired</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {visible.map((holding) => (
              <tr key={holding.ticker}>
                <td>
                  <strong>{holding.ticker}</strong>
                  <small>
                    {holding.data_status === "live"
                      ? "Latest available data"
                      : "Price unavailable"}
                  </small>
                </td>
                <td>
                  {holding.weight != null
                    ? `${holding.weight.toFixed(2)}%`
                    : "N/A"}
                </td>
                <td
                  className={
                    (holding.day_gain_pct ?? 0) >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {formatPct(holding.day_gain_pct)}
                </td>
                <td
                  className={
                    (holding.total_gain_pct ?? 0) >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  <strong>
                    {formatPct(holding.total_gain_pct)}
                  </strong>
                </td>
                <td>{holding.acquired}</td>
                <td>
                  <Link href={`/stocks/${holding.ticker}`}>
                    Workbook →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
