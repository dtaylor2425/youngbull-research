import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getUniverseScores } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function StocksPage() {
  const result = await getUniverseScores().catch(() => ({ as_of: null, stocks: [] }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero container">
        <div className="eyebrow">LIVE STOCK INTELLIGENCE</div>
        <h1>The Young Bull Universe</h1>
        <p>Cross-sectional scoring across momentum, technical structure, fundamentals and thematic fit.</p>
      </section>
      <section className="container page-section">
        <div className="score-method-banner">
          <span>MODEL</span>
          <strong>25% Momentum · 25% Technicals · 30% Fundamentals · 20% Thematic Fit</strong>
          <small>{result.as_of ? `Updated ${result.as_of}` : "No score run found. Run the backend refresh job."}</small>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Rank</th><th>Ticker</th><th>Company</th><th>Theme</th><th>Overall</th><th>Momentum</th><th>Technical</th><th>Fundamental</th><th></th></tr></thead>
            <tbody>
              {result.stocks.map((stock, index) => (
                <tr key={stock.ticker}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td><strong className="gold">{stock.ticker}</strong></td>
                  <td>{stock.company}</td>
                  <td><span className="tag">{stock.theme}</span></td>
                  <td><strong>{stock.overall.toFixed(1)}</strong></td>
                  <td>{stock.momentum.toFixed(1)}</td>
                  <td>{stock.technicals.toFixed(1)}</td>
                  <td>{stock.fundamentals.toFixed(1)}</td>
                  <td><Link className="table-link" href={`/stocks/${stock.ticker}`}>Workbook →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
