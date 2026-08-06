"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Stock = {
  ticker: string;
  company: string;
  theme: string;
  price: number | null;
  market_cap: number | null;
  momentum: number;
  technicals: number;
  fundamentals: number;
  thematic_fit: number;
  overall: number;
};

type SortKey =
  | "overall"
  | "momentum"
  | "technicals"
  | "fundamentals"
  | "thematic_fit"
  | "ticker";

export function LiveUniverseTable({ stocks }: { stocks: Stock[] }) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("overall");
  const [ascending, setAscending] = useState(false);

  const themes = useMemo(
    () => ["All", ...Array.from(new Set(stocks.map((stock) => stock.theme))).sort()],
    [stocks]
  );

  const rows = useMemo(() => {
    const filtered = stocks.filter((stock) => {
      const matchesQuery = `${stock.ticker} ${stock.company}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTheme = theme === "All" || stock.theme === theme;
      return matchesQuery && matchesTheme;
    });

    return filtered.sort((a, b) => {
      if (sortKey === "ticker") {
        const comparison = a.ticker.localeCompare(b.ticker);
        return ascending ? comparison : -comparison;
      }

      const comparison = a[sortKey] - b[sortKey];
      return ascending ? comparison : -comparison;
    });
  }, [stocks, query, theme, sortKey, ascending]);

  function selectSort(next: SortKey) {
    if (next === sortKey) {
      setAscending((current) => !current);
      return;
    }
    setSortKey(next);
    setAscending(next === "ticker");
  }

  return (
    <>
      <div className="universe-controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ticker or company"
        />

        <select value={theme} onChange={(event) => setTheme(event.target.value)}>
          {themes.map((item) => <option key={item}>{item}</option>)}
        </select>

        <div className="universe-result-count">
          <span>VISIBLE</span>
          <strong>{rows.length}</strong>
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table universe-live-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th><button onClick={() => selectSort("ticker")}>Ticker</button></th>
              <th>Company</th>
              <th>Theme</th>
              <th><button onClick={() => selectSort("overall")}>Overall</button></th>
              <th><button onClick={() => selectSort("momentum")}>Momentum</button></th>
              <th><button onClick={() => selectSort("technicals")}>Technical</button></th>
              <th><button onClick={() => selectSort("fundamentals")}>Fundamental</button></th>
              <th><button onClick={() => selectSort("thematic_fit")}>Theme fit</button></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((stock, index) => (
              <tr key={stock.ticker}>
                <td>{String(index + 1).padStart(3, "0")}</td>
                <td><strong className="gold">{stock.ticker}</strong></td>
                <td>{stock.company}</td>
                <td><span className="tag">{stock.theme}</span></td>
                <td><strong>{stock.overall.toFixed(1)}</strong></td>
                <td>{stock.momentum.toFixed(1)}</td>
                <td>{stock.technicals.toFixed(1)}</td>
                <td>{stock.fundamentals.toFixed(1)}</td>
                <td>{stock.thematic_fit.toFixed(1)}</td>
                <td>
                  <Link className="table-link" href={`/stocks/${stock.ticker}`}>
                    Workbook →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
