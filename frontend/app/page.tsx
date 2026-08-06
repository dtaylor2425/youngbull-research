import "./home-header-fixes.css";

import Link from "next/link";
import { PerformancePortfolioTable } from "@/components/PerformancePortfolioTable";
import { SiteHeader } from "@/components/SiteHeader";
import { StockSearch } from "@/components/StockSearch";
import { getPortfolio, getUniverseScores } from "@/lib/api";
import { researchPosts } from "@/lib/researchData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [portfolio, universe] = await Promise.all([
    getPortfolio(),
    getUniverseScores().catch(() => ({ as_of: null, stocks: [] })),
  ]);

  const winners = portfolio.holdings.filter(
    (holding) => holding.total_gain_pct >= 0
  ).length;

  return (
    <main>
      <SiteHeader />

      <section className="hero container compact-hero terminal-home-hero">
        <div className="eyebrow">THE PHYSICAL LAYER OF AI</div>
        <h1>
          Young Bull Invests
          <span> Terminal.</span>
        </h1>
        <p>
          Live stock scores, portfolio performance, AI intelligence and premium
          company workbooks.
        </p>
        <StockSearch />
      </section>

      <section className="performance-home-strip">
        <div className="container performance-home-kpis">
          <div>
            <span>PORTFOLIO RETURN</span>
            <strong
              className={
                portfolio.summary.total_return_pct >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {portfolio.summary.total_return_pct > 0 ? "+" : ""}
              {portfolio.summary.total_return_pct.toFixed(2)}%
            </strong>
          </div>

          <div>
            <span>WINNING POSITIONS</span>
            <strong>
              {winners} / {portfolio.summary.holdings}
            </strong>
          </div>

          <div>
            <span>POSITIONS</span>
            <strong>{portfolio.summary.holdings}</strong>
          </div>

          <div>
            <span>SCORES UPDATED</span>
            <strong>{universe.as_of ?? "Pending"}</strong>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">PORTFOLIO PERFORMANCE</div>
            <h2>What Young Bull owns</h2>
          </div>
          <Link href="/portfolio" className="text-link">
            FULL PORTFOLIO →
          </Link>
        </div>

        <p className="section-intro">
          Performance snapshot as of {portfolio.as_of}. No account value or
          dollar position size is displayed.
        </p>

        <PerformancePortfolioTable holdings={portfolio.holdings.slice(0, 10)} />
      </section>

      <section className="section dark-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">LIVE MODEL OUTPUT</div>
              <h2>Highest scored stocks</h2>
            </div>
            <Link href="/stocks" className="text-link">
              EXPLORE UNIVERSE →
            </Link>
          </div>

          <div className="top-ideas-grid">
            {universe.stocks.slice(0, 6).map((stock: any, index: number) => (
              <Link
                href={`/stocks/${stock.ticker}`}
                className="idea-row"
                key={stock.ticker}
              >
                <span className="rank">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{stock.ticker}</strong>
                  <small>{stock.theme}</small>
                </div>
                <p>{stock.company}</p>
                <b>{stock.overall.toFixed(1)}</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">FROM THE SUBSTACK</div>
            <h2>Latest research</h2>
          </div>
          <a
            href="https://youngbullinvests.substack.com"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            OPEN SUBSTACK →
          </a>
        </div>

        <div className="research-list">
          {researchPosts.slice(0, 5).map((post) => (
            <a
              className="research-row-link"
              href={post.url}
              target="_blank"
              rel="noreferrer"
              key={post.title}
            >
              <span>{post.date}</span>
              <div>
                <small>
                  {post.theme} · {post.access}
                </small>
                <h3>{post.title}</h3>
              </div>
              <div className="research-open-label">READ ON SUBSTACK ↗</div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
