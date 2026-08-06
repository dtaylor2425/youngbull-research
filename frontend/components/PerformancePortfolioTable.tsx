"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioHolding } from "@/lib/types";

type SortKey =
  | "weight"
  | "total_gain_pct"
  | "day_gain_pct"
  | "acquired";

export function PerformancePortfolioTable({
  holdings,
}: {
  holdings: PortfolioHolding[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("weight");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return [...holdings].sort((a, b) => {
      if (sortKey === "acquired") {
        const comparison =
          new Date(a.acquired).getTime() - new Date(b.acquired).getTime();
        return direction === "asc" ? comparison : -comparison;
      }

      const comparison = a[sortKey] - b[sortKey];
      return direction === "asc" ? comparison : -comparison;
    });
  }, [holdings, sortKey, direction]);

  function chooseSort(next: SortKey) {
    if (next === sortKey) {
      setDirection((current) => (current === "desc" ? "asc" : "desc"));
      return;
    }

    setSortKey(next);
    setDirection("desc");
  }

  return (
    <div>
      <div className="performance-sort">
        <span>SORT BY</span>
        <button
          className={sortKey === "weight" ? "active" : ""}
          onClick={() => chooseSort("weight")}
        >
          Weight
        </button>
        <button
          className={sortKey === "total_gain_pct" ? "active" : ""}
          onClick={() => chooseSort("total_gain_pct")}
        >
          Total return
        </button>
        <button
          className={sortKey === "day_gain_pct" ? "active" : ""}
          onClick={() => chooseSort("day_gain_pct")}
        >
          Daily return
        </button>
        <button
          className={sortKey === "acquired" ? "active" : ""}
          onClick={() => chooseSort("acquired")}
        >
          Entry date
        </button>
      </div>

      <div className="performance-table-wrap">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Portfolio weight</th>
              <th>Day</th>
              <th>Total return</th>
              <th>Date acquired</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((holding) => {
              const status =
                holding.total_gain_pct >= 25
                  ? "Leader"
                  : holding.total_gain_pct >= 0
                    ? "Positive"
                    : holding.total_gain_pct > -20
                      ? "Underwater"
                      : "Deep drawdown";

              return (
                <tr key={holding.ticker}>
                  <td>
                    <strong>{holding.ticker}</strong>
                    <small>
                      {holding.total_gain_pct >= 0
                        ? "Profitable position"
                        : "Below entry"}
                    </small>
                  </td>

                  <td>
                    <div className="weight-cell">
                      <span>{holding.weight.toFixed(2)}%</span>
                      <div>
                        <i style={{ width: `${holding.weight * 7}%` }} />
                      </div>
                    </div>
                  </td>

                  <td
                    className={
                      holding.day_gain_pct >= 0 ? "positive" : "negative"
                    }
                  >
                    {holding.day_gain_pct > 0 ? "+" : ""}
                    {holding.day_gain_pct.toFixed(2)}%
                  </td>

                  <td
                    className={
                      holding.total_gain_pct >= 0 ? "positive" : "negative"
                    }
                  >
                    <strong>
                      {holding.total_gain_pct > 0 ? "+" : ""}
                      {holding.total_gain_pct.toFixed(2)}%
                    </strong>
                  </td>

                  <td>{holding.acquired}</td>

                  <td>
                    <span
                      className={`performance-status ${status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td>
                    <Link href={`/stocks/${holding.ticker}`}>
                      Workbook →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
