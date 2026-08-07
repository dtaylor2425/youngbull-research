import "./research.css";
import { SiteHeader } from "@/components/SiteHeader";
import { researchPosts } from "@/lib/researchData";

export const dynamic = "force-dynamic";

export default function ResearchPage() {
  return (
    <main>
      <SiteHeader />

      <section className="page-hero container research-hero">
        <div className="eyebrow">YOUNG BULL INTELLIGENCE</div>
        <h1>Research Library</h1>
        <p>
          Deep dives, portfolio updates and AI infrastructure research from
          Young Bull. Every card opens the original Substack article.
        </p>
      </section>

      <section className="container research-toolbar">
        <div>
          <span>ARTICLES</span>
          <strong>{researchPosts.length}</strong>
        </div>

        <a
          href="https://youngbullinvests.substack.com"
          target="_blank"
          rel="noreferrer"
        >
          OPEN YOUNG BULL SUBSTACK ↗
        </a>
      </section>

      <section className="container research-grid">
        {researchPosts.map((post, index) => (
          <a
            className="research-card"
            href={post.url}
            target="_blank"
            rel="noreferrer"
            key={post.title}
          >
            <div className="research-card-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{post.date}</small>
            </div>

            <div className="research-card-meta">
              <span>{post.theme}</span>
              <span>{post.access}</span>
            </div>

            <h2>{post.title}</h2>

            {post.tickers.length > 0 && (
              <div className="research-card-tickers">
                {post.tickers.map((ticker) => (
                  <span key={ticker}>{ticker}</span>
                ))}
              </div>
            )}

            <div className="research-card-footer">
              <span>READ ON SUBSTACK</span>
              <strong>↗</strong>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
