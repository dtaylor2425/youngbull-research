"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioHolding } from "@/lib/types";

type SortKey = "weight" | "total_gain_pct" | "day_gain_pct" | "acquired";
const pct = (v:number|null) => v == null ? "N/A" : `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

function statusFor(v:number|null) {
  if (v == null) return "Unavailable";
  if (v >= 25) return "Leader";
  if (v >= 0) return "Positive";
  if (v > -20) return "Underwater";
  return "Deep drawdown";
}

export function PerformancePortfolioTable({ holdings, compact=false }:{holdings:PortfolioHolding[]; compact?:boolean}) {
  const [sortKey,setSortKey] = useState<SortKey>("weight");
  const [direction,setDirection] = useState<"asc"|"desc">("desc");

  const sorted = useMemo(() => [...holdings].sort((a,b) => {
    if (sortKey === "acquired") {
      const c = new Date(a.acquired).getTime() - new Date(b.acquired).getTime();
      return direction === "asc" ? c : -c;
    }
    const av = a[sortKey], bv = b[sortKey];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return direction === "asc" ? av-bv : bv-av;
  }), [holdings,sortKey,direction]);

  function choose(next:SortKey) {
    if (next === sortKey) setDirection(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(next); setDirection("desc"); }
  }

  return (
    <div className={compact ? "portfolio-performance compact" : "portfolio-performance"}>
      {!compact && <div className="performance-sort">
        <span>SORT BY</span>
        <button onClick={()=>choose("weight")}>Weight</button>
        <button onClick={()=>choose("total_gain_pct")}>Total return</button>
        <button onClick={()=>choose("day_gain_pct")}>Daily return</button>
        <button onClick={()=>choose("acquired")}>Entry date</button>
      </div>}

      <div className="performance-mobile-cards">
        {sorted.map(h => {
          const status = statusFor(h.total_gain_pct);
          return <Link className="performance-mobile-card" href={`/stocks/${h.ticker}`} key={h.ticker}>
            <div className="performance-card-top">
              <div><strong>{h.ticker}</strong><small>{h.weight != null ? `${h.weight.toFixed(2)}% weight` : "Weight unavailable"}</small></div>
              <span className={`performance-status ${status.toLowerCase().replaceAll(" ","-")}`}>{status}</span>
            </div>
            <div className="performance-card-metrics">
              <div><span>DAY</span><b className={(h.day_gain_pct ?? 0)>=0?"positive":"negative"}>{pct(h.day_gain_pct)}</b></div>
              <div><span>TOTAL RETURN</span><b className={(h.total_gain_pct ?? 0)>=0?"positive":"negative"}>{pct(h.total_gain_pct)}</b></div>
              <div><span>ACQUIRED</span><b>{h.acquired}</b></div>
            </div>
            <div className="performance-card-link">OPEN WORKBOOK →</div>
          </Link>;
        })}
      </div>

      <div className="performance-table-wrap">
        <table className="performance-table">
          <thead><tr><th>Position</th><th>Weight</th><th>Day</th><th>Total return</th><th>Acquired</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {sorted.map(h => {
              const status = statusFor(h.total_gain_pct);
              return <tr key={h.ticker}>
                <td><strong>{h.ticker}</strong><small>{h.data_status==="live"?"Latest available data":"Price unavailable"}</small></td>
                <td>{h.weight != null ? `${h.weight.toFixed(2)}%` : "N/A"}</td>
                <td className={(h.day_gain_pct ?? 0)>=0?"positive":"negative"}>{pct(h.day_gain_pct)}</td>
                <td className={(h.total_gain_pct ?? 0)>=0?"positive":"negative"}><strong>{pct(h.total_gain_pct)}</strong></td>
                <td>{h.acquired}</td>
                <td><span className={`performance-status ${status.toLowerCase().replaceAll(" ","-")}`}>{status}</span></td>
                <td><Link href={`/stocks/${h.ticker}`}>Workbook →</Link></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
