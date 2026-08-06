import "./performance-portfolio.css";

import { PerformancePortfolioTable } from "@/components/PerformancePortfolioTable";
import { SiteHeader } from "@/components/SiteHeader";
import { getPortfolio } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const portfolio = await getPortfolio();

  const winners = portfolio.holdings.filter((holding) => holding.total_gain_pct >= 0);
  const losers = portfolio.holdings.filter((holding) => holding.total_gain_pct < 0);
  const best = [...portfolio.holdings].sort(
    (a, b) => b.total_gain_pct - a.total_gain_pct
  )[0];
  const worst = [...portfolio.holdings].sort(
    (a, b) => a.total_gain_pct - b.total_gain_pct
  )[0];

  return (
    <main>
      <SiteHeader />

      <section className="page-hero container performance-portfolio-hero">
        <div className="eyebrow">REAL POSITIONS · PERFORMANCE ONLY</div>
        <h1>Young Bull Portfolio</h1>
        <p>
          A transparent view of portfolio performance without exposing account
          value, position cost or dollar gains.
        </p>
      </section>

      <section className="container performance-kpis">
        <article>
          <span>TOTAL RETURN</span>
          <strong
            className={
              portfolio.summary.total_return_pct >= 0 ? "positive" : "negative"
            }
          >
            {portfolio.summary.total_return_pct > 0 ? "+" : ""}
            {portfolio.summary.total_return_pct.toFixed(2)}%
          </strong>
        </article>

        <article>
          <span>WINNING POSITIONS</span>
          <strong>
            {winners.length} / {portfolio.summary.holdings}
          </strong>
        </article>

        <article>
          <span>BEST POSITION</span>
          <strong className="positive">{best.ticker}</strong>
          <small>+{best.total_gain_pct.toFixed(2)}%</small>
        </article>

        <article>
          <span>LARGEST DRAWDOWN</span>
          <strong className="negative">{worst.ticker}</strong>
          <small>{worst.total_gain_pct.toFixed(2)}%</small>
        </article>

        <article>
          <span>POSITIONS</span>
          <strong>{portfolio.summary.holdings}</strong>
        </article>
      </section>

      <section className="container page-section">
        <div className="portfolio-page-heading">
          <div>
            <div className="eyebrow">POSITION PERFORMANCE</div>
            <h2>Current holdings</h2>
          </div>
          <small>Snapshot: {portfolio.as_of}</small>
        </div>

        <PerformancePortfolioTable holdings={portfolio.holdings} />

        <p className="disclaimer">
          Performance is based on the supplied brokerage snapshot and may not
          reflect trades or price changes made after the listed date.
        </p>
      </section>
    </main>
  );
}
