import "./ai-news.css";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import AI_NEWS from "@/lib/aiNews";

function directionClass(direction: string) {
  return direction.toLowerCase().replace(/\s+/g, "-");
}

export default function AiNewsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="page-hero container ai-news-hero">
        <div className="eyebrow">AI INTELLIGENCE FEED</div>
        <h1>The stories moving the stack.</h1>
        <p>
          A hardcoded editorial feed focused on the AI supply chain, the market
          impact and the stocks closest to each development.
        </p>
      </section>

      <section className="container ai-news-layout">
        <aside className="ai-news-sidebar">
          <div className="sidebar-sticky">
            <span className="eyebrow">LATEST UPDATE</span>
            <strong>{AI_NEWS[0]?.updated}</strong>
            <p>{AI_NEWS.length} active stories</p>
            <div className="sidebar-index">
              {AI_NEWS.map((item) => (
                <a key={item.id} href={`#${item.id}`}>
                  <span>{String(item.rank).padStart(2, "0")}</span>
                  {item.category}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div className="ai-news-feed">
          {AI_NEWS.map((item) => (
            <article id={item.id} className="ai-news-card" key={item.id}>
              <div className="ai-news-card-top">
                <div className="news-rank">{String(item.rank).padStart(2, "0")}</div>
                <div className="news-meta">
                  <span>{item.category}</span>
                  <span>{item.status}</span>
                  <span>{item.urgency} urgency</span>
                  <span>{item.updated}</span>
                </div>
              </div>

              <h2>{item.title}</h2>
              <p className="news-one-line">{item.oneLine}</p>

              <div className="news-section">
                <div className="news-section-label">WHY IT MATTERS</div>
                <ul>
                  {item.whyItMatters.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>

              <div className="impact-grid">
                {item.marketImpact.map((impact) => (
                  <div className="impact-card" key={impact.label}>
                    <div>
                      <span>{impact.label}</span>
                      <strong className={directionClass(impact.direction)}>
                        {impact.direction}
                      </strong>
                    </div>
                    <p>{impact.reason}</p>
                  </div>
                ))}
              </div>

              <div className="news-section">
                <div className="news-section-label">STOCK EXPRESSIONS</div>
                <div className="news-ticker-grid">
                  {item.tickers.map((stock) => (
                    <Link href={`/stocks/${stock.ticker}`} key={stock.ticker}>
                      <div>
                        <strong>{stock.ticker}</strong>
                        <span className={directionClass(stock.stance)}>{stock.stance}</span>
                      </div>
                      <p>{stock.why}</p>
                      <small>OPEN WORKBOOK →</small>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="news-bottom-grid">
                <div>
                  <div className="news-section-label">INVALIDATION</div>
                  <p>{item.invalidation}</p>
                </div>
                <div>
                  <div className="news-section-label">WATCH NEXT</div>
                  <ul>
                    {item.watchNext.map((trigger) => <li key={trigger}>{trigger}</li>)}
                  </ul>
                </div>
              </div>

              <div className="news-source">
                <span>SOURCE</span>
                {item.sourceUrl ? (
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel}</a>
                ) : (
                  <strong>{item.sourceLabel}</strong>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
