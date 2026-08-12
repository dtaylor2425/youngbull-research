"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioHolding } from "@/lib/types";

type SortKey =
  | "weight"
  | "total_gain_pct"
  | "day_gain_pct"
  | "acquired";

function formatPct(value: number | null) {
  if (value == null) return "N/A";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function statusFor(value: number | null) {
  if (value == null) return "Unavailable";
  if (value >= 25) return "Leader";
  if (value >= 0) return "Positive";
  if (value > -20) return "Underwater";
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
          new Date(a.acquired).getTime() -
          new Date(b.acquired).getTime();
        return direction === "asc" ? comparison : -comparison;
      }

      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = aValue - bValue;
      return direction === "asc" ? comparison : -comparison;
    });
  }, [holdings, sortKey, direction]);

  function chooseSort(next: SortKey) {
    if (next === sortKey) {
      setDirection((current) =>
        current === "desc" ? "asc" : "desc"
      );
      return;
    }

    setSortKey(next);
    setDirection("desc");
  }

  return (
    <div
      className={
        compact
          ? "portfolio-performance compact"
          : "portfolio-performance"
      }
    >
      {!compact && (
        <div className="performance-sort">
          <span>SORT BY</span>
          <button
            className={sortKey === "weight" ? "active" : ""}
            onClick={() => chooseSort("weight")}
          >
            Weight
          </button>
          <button
            className={
              sortKey === "total_gain_pct" ? "active" : ""
            }
            onClick={() => chooseSort("total_gain_pct")}
          >
            Total return
          </button>
          <button
            className={
              sortKey === "day_gain_pct" ? "active" : ""
            }
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
      )}

      <div className="performance-mobile-cards">
        {sorted.map((holding) => {
          const status = statusFor(holding.total_gain_pct);

          return (
            <Link
              className="performance-mobile-card"
              href={`/stocks/${holding.ticker}`}
              key={holding.ticker}
            >
              <div className="performance-card-top">
                <div>
                  <strong>{holding.ticker}</strong>
                  <small>
                    {holding.weight != null
                      ? `${holding.weight.toFixed(2)}% weight`
                      : "Weight unavailable"}
                  </small>
                </div>

                <span
                  className={`performance-status ${status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {status}
                </span>
              </div>

              <div className="performance-card-metrics">
                <div>
                  <span>DAY</span>
                  <b
                    className={
                      (holding.day_gain_pct ?? 0) >= 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {formatPct(holding.day_gain_pct)}
                  </b>
                </div>

                <div>
                  <span>TOTAL RETURN</span>
                  <b
                    className={
                      (holding.total_gain_pct ?? 0) >= 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {formatPct(holding.total_gain_pct)}
                  </b>
                </div>

                <div>
                  <span>ACQUIRED</span>
                  <b>{holding.acquired}</b>
                </div>
              </div>

              <div className="performance-card-link">
                OPEN WORKBOOK →
              </div>
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
                    <span
                      className={`performance-status ${status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
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
