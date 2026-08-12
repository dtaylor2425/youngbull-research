import "./performance-portfolio.css";
import "../mobile-workbook-fixes.css";
import { PerformancePortfolioTable } from "@/components/PerformancePortfolioTable";
import { SiteHeader } from "@/components/SiteHeader";
import { getPortfolio } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const pct = (v:number|null) => v == null ? "N/A" : `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

export default async function PortfolioPage() {
  const portfolio = await getPortfolio();
  return <main>
    <SiteHeader/>
    <section className="page-hero container performance-portfolio-hero">
      <div className="eyebrow">REAL POSITIONS · PERFORMANCE ONLY</div>
      <h1>Young Bull Portfolio</h1>
      <p>Portfolio performance calculated from the latest available market data. Dollar values remain private.</p>
    </section>

    <section className="container performance-kpis">
      <article><span>TOTAL RETURN</span><strong className={(portfolio.summary.total_return_pct ?? 0)>=0?"positive":"negative"}>{pct(portfolio.summary.total_return_pct)}</strong></article>
      <article><span>DAY</span><strong className={(portfolio.summary.day_return_pct ?? 0)>=0?"positive":"negative"}>{pct(portfolio.summary.day_return_pct)}</strong></article>
      <article><span>WINNING POSITIONS</span><strong>{portfolio.summary.winning_positions} / {portfolio.summary.holdings}</strong></article>
      <article><span>BEST POSITION</span><strong className="positive">{portfolio.summary.best_position?.ticker ?? "N/A"}</strong><small>{portfolio.summary.best_position ? pct(portfolio.summary.best_position.return_pct) : ""}</small></article>
      <article><span>LARGEST DRAWDOWN</span><strong className="negative">{portfolio.summary.worst_position?.ticker ?? "N/A"}</strong><small>{portfolio.summary.worst_position ? pct(portfolio.summary.worst_position.return_pct) : ""}</small></article>
    </section>

    <section className="container page-section">
      <div className="portfolio-page-heading">
        <div><div className="eyebrow">POSITION PERFORMANCE</div><h2>Current holdings</h2></div>
        <small>Live coverage: {portfolio.summary.coverage_pct.toFixed(0)}%</small>
      </div>
      <PerformancePortfolioTable holdings={portfolio.holdings}/>
      <p className="disclaimer">Returns use the latest market data available through the site's data provider and may differ from brokerage intraday P&amp;L.</p>
    </section>
  </main>;
}
