"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pseudoScore, universe } from "@/lib/researchData";

export function UniverseTable() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("All");
  const themes = ["All", ...Array.from(new Set(universe.map((x) => x.theme)))];

  const rows = useMemo(() => universe
    .map((stock) => ({ ...stock, ...pseudoScore(stock.ticker, stock.thematicFit) }))
    .filter((stock) => {
      const matchesQuery = `${stock.ticker} ${stock.company}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (theme === "All" || stock.theme === theme);
    })
    .sort((a, b) => b.overall - a.overall), [query, theme]);

  return (
    <>
      <div className="table-controls">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ticker or company" />
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {themes.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>Ticker</th><th>Company</th><th>Theme</th><th>Overall</th><th>Momentum</th><th>Technical</th><th>Fundamental</th><th></th></tr></thead>
          <tbody>
            {rows.map((stock) => (
              <tr key={stock.ticker}>
                <td><strong className="gold">{stock.ticker}</strong></td>
                <td>{stock.company}</td>
                <td><span className="tag">{stock.theme}</span></td>
                <td><strong>{stock.overall}</strong></td>
                <td>{stock.momentum}</td>
                <td>{stock.technicals}</td>
                <td>{stock.fundamentals}</td>
                <td><Link className="table-link" href={`/stocks/${stock.ticker}`}>Workbook →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
