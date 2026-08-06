"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioHolding } from "@/lib/types";

type SortKey = "weight" | "total_gain_pct" | "day_gain_pct" | "acquired";

function statusFor(returnPct: number) {
  if (returnPct >= 25) return "Leader";
  if (returnPct >= 0) return "Positive";
  if (returnPct > -20) return "Underwater";
  return "Deep drawdown";
}

export function PerformancePortfolioTable({
  holdings,
  compact = false,
}: {
  holdings: PortfolioHolding[];
  compact?: boolean;
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
    <div className={compact ? "portfolio-performance compact" : "portfolio-performance"}>
      {!compact && (
        <div className="performance-sort">
          <span>SORT BY</span>
          <button className={sortKey === "weight" ? "active" : ""} onClick={() => chooseSort("weight")}>
            Weight
          </button>
          <button className={sortKey === "total_gain_pct" ? "active" : ""} onClick={() => chooseSort("total_gain_pct")}>
            Total return
          </button>
          <button className={sortKey === "day_gain_pct" ? "active" : ""} onClick={() => chooseSort("day_gain_pct")}>
            Daily return
          </button>
          <button className={sortKey === "acquired" ? "active" : ""} onClick={() => chooseSort("acquired")}>
            Entry date
          </button>
        </div>
      )}

      <div className="performance-mobile-cards">
        {sorted.map((holding) => {
          const status = statusFor(holding.total_gain_pct);
          return (
            <Link className="performance-mobile-card" href={`/stocks/${holding.ticker}`} key={holding.ticker}>
              <div className="performance-card-top">
                <div>
                  <strong>{holding.ticker}</strong>
                  <small>{holding.weight.toFixed(2)}% weight</small>
                </div>
                <span className={`performance-status ${status.toLowerCase().replaceAll(" ", "-")}`}>
                  {status}
                </span>
              </div>

              <div className="performance-card-metrics">
                <div>
                  <span>DAY</span>
                  <b className={holding.day_gain_pct >= 0 ? "positive" : "negative"}>
                    {holding.day_gain_pct > 0 ? "+" : ""}
                    {holding.day_gain_pct.toFixed(2)}%
                  </b>
                </div>
                <div>
                  <span>TOTAL RETURN</span>
                  <b className={holding.total_gain_pct >= 0 ? "positive" : "negative"}>
                    {holding.total_gain_pct > 0 ? "+" : ""}
                    {holding.total_gain_pct.toFixed(2)}%
                  </b>
                </div>
                <div>
                  <span>ACQUIRED</span>
                  <b>{holding.acquired}</b>
                </div>
              </div>

              <div className="performance-card-link">OPEN WORKBOOK →</div>
            </Link>
          );
        })}
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
              const status = statusFor(holding.total_gain_pct);

              return (
                <tr key={holding.ticker}>
                  <td>
                    <strong>{holding.ticker}</strong>
                    <small>{holding.total_gain_pct >= 0 ? "Profitable position" : "Below entry"}</small>
                  </td>
                  <td>
                    <div className="weight-cell">
                      <span>{holding.weight.toFixed(2)}%</span>
                      <div><i style={{ width: `${Math.min(100, holding.weight * 7)}%` }} /></div>
                    </div>
                  </td>
                  <td className={holding.day_gain_pct >= 0 ? "positive" : "negative"}>
                    {holding.day_gain_pct > 0 ? "+" : ""}
                    {holding.day_gain_pct.toFixed(2)}%
                  </td>
                  <td className={holding.total_gain_pct >= 0 ? "positive" : "negative"}>
                    <strong>
                      {holding.total_gain_pct > 0 ? "+" : ""}
                      {holding.total_gain_pct.toFixed(2)}%
                    </strong>
                  </td>
                  <td>{holding.acquired}</td>
                  <td>
                    <span className={`performance-status ${status.toLowerCase().replaceAll(" ", "-")}`}>
                      {status}
                    </span>
                  </td>
                  <td><Link href={`/stocks/${holding.ticker}`}>Workbook →</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
