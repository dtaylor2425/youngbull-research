import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { StockSearch } from "@/components/StockSearch";
import { portfolioTickers, pseudoScore, researchPosts, universe } from "@/lib/researchData";

export default function Home() {
  const portfolio = portfolioTickers.map((ticker) => {
    const stock = universe.find((item) => item.ticker === ticker);
    return stock || { ticker, company: ticker, theme: "Young Bull Portfolio", thematicFit: 82, conviction: "Watch" as const, note: "Portfolio holding." };
  });

  const topIdeas = universe
    .map((stock) => ({ ...stock, ...pseudoScore(stock.ticker, stock.thematicFit) }))
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 6);

  return (
    <main>
      <SiteHeader />

      <section className="hero container compact-hero">
        <div className="eyebrow">YOUNG BULL RESEARCH TERMINAL</div>
        <h1>Own the companies <span>behind the trade.</span></h1>
        <p>Stock research for the physical layer of AI, built around a real portfolio, transparent theses and company-level workbooks.</p>
        <StockSearch />
      </section>

      <section className="market-strip">
        <div className="container strip-grid">
          <div><span>PORTFOLIO</span><strong>{portfolio.length} Holdings</strong></div>
          <div><span>UNIVERSE</span><strong>{universe.length}+ Stocks</strong></div>
          <div><span>PRIMARY THEME</span><strong>AI Infrastructure</strong></div>
          <div><span>RESEARCH</span><strong className="live">Actively Updated</strong></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div><div className="eyebrow">REAL POSITIONS</div><h2>Young Bull Portfolio</h2></div>
          <Link href="/portfolio" className="text-link">VIEW FULL PORTFOLIO →</Link>
        </div>
        <div className="portfolio-grid">
          {portfolio.map((stock) => (
            <article className="holding-card" key={stock.ticker}>
              <div><strong>{stock.ticker}</strong><span>{stock.theme}</span></div>
              <p>{stock.company}</p>
              <Link href={`/stocks/${stock.ticker}`}>OPEN WORKBOOK →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-section">
        <div className="container">
          <div className="section-heading">
            <div><div className="eyebrow">MODEL OUTPUT</div><h2>Highest Scored Stocks</h2></div>
            <Link href="/stocks" className="text-link">EXPLORE UNIVERSE →</Link>
          </div>
          <div className="top-ideas-grid">
            {topIdeas.map((stock, index) => (
              <Link href={`/stocks/${stock.ticker}`} className="idea-row" key={stock.ticker}>
                <span className="rank">0{index + 1}</span>
                <div><strong>{stock.ticker}</strong><small>{stock.theme}</small></div>
                <p>{stock.note}</p>
                <b>{stock.overall}</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div><div className="eyebrow">LATEST WORK</div><h2>Research Library</h2></div>
          <Link href="/research" className="text-link">VIEW ALL RESEARCH →</Link>
        </div>
        <div className="research-list">
          {researchPosts.slice(0, 4).map((post) => (
            <article key={post.title}>
              <span>{post.date}</span>
              <div><small>{post.theme} · {post.access}</small><h3>{post.title}</h3></div>
              <div>{post.tickers.map((ticker) => <Link key={ticker} href={`/stocks/${ticker}`}>{ticker}</Link>)}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
