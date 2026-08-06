import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { researchPosts } from "@/lib/researchData";
import "./portfolio/performance-portfolio.css";
import "./home-header-fixes.css";
import "./mobile-workbook-fixes.css";


import { PerformancePortfolioTable } from "@/components/PerformancePortfolioTable";
export default function ResearchPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero container">
        <div className="eyebrow">RESEARCH ARCHIVE</div>
        <h1>Every thesis. Organized.</h1>
        <p>The research library connects each article to the companies and investment themes it affects.</p>
      </section>
      <section className="container page-section">
        <div className="research-archive">
          {researchPosts.map((post, index) => (
            <article key={post.title}>
              <span className="archive-number">{String(index + 1).padStart(2, "0")}</span>
              <div><small>{post.date} · {post.theme} · {post.access}</small><h2>{post.title}</h2></div>
              <div className="ticker-links">{post.tickers.map((ticker) => <Link key={ticker} href={`/stocks/${ticker}`}>{ticker}</Link>)}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
