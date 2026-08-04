import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { portfolioTickers, pseudoScore, universe } from "@/lib/researchData";

export default function PortfolioPage() {
  const holdings = portfolioTickers.map((ticker, index) => {
    const stock = universe.find((x) => x.ticker === ticker);
    const base = stock || { ticker, company: ticker, theme: "Portfolio", thematicFit: 82, conviction: "Watch" as const, note: "Young Bull portfolio holding." };
    return { ...base, ...pseudoScore(ticker, base.thematicFit), status: index < 6 ? "Core" : index < 13 ? "Active" : "Watch" };
  });

  return (
    <main>
      <SiteHeader />
      <section className="page-hero container">
        <div className="eyebrow">REAL MONEY · REAL POSITIONS</div>
        <h1>Portfolio</h1>
        <p>A transparent view of the companies Young Bull owns and the research attached to each position.</p>
      </section>
      <section className="container portfolio-summary">
        <div><span>HOLDINGS</span><strong>{holdings.length}</strong></div>
        <div><span>CORE POSITIONS</span><strong>{holdings.filter(x => x.status === "Core").length}</strong></div>
        <div><span>AVERAGE SCORE</span><strong>{Math.round(holdings.reduce((s, x) => s + x.overall, 0) / holdings.length)}</strong></div>
        <div><span>PRIMARY EXPOSURE</span><strong>AI Infrastructure</strong></div>
      </section>
      <section className="container page-section">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Symbol</th><th>Company</th><th>Theme</th><th>Status</th><th>Score</th><th>Thesis</th><th></th></tr></thead>
            <tbody>
              {holdings.map((stock) => (
                <tr key={stock.ticker}>
                  <td><strong className="gold">{stock.ticker}</strong></td>
                  <td>{stock.company}</td>
                  <td><span className="tag">{stock.theme}</span></td>
                  <td>{stock.status}</td>
                  <td><strong>{stock.overall}</strong></td>
                  <td className="thesis-cell">{stock.note}</td>
                  <td><Link className="table-link" href={`/stocks/${stock.ticker}`}>Workbook →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="disclaimer">Position sizes and cost basis are intentionally omitted until the portfolio data is connected to a controlled database or brokerage export.</p>
      </section>
    </main>
  );
}
