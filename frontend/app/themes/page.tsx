import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { themes } from "@/lib/researchData";

export default function ThemesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero container">
        <div className="eyebrow">THE PHYSICAL LAYER OF AI</div>
        <h1>Investment Themes</h1>
        <p>Track where capital spending is moving, where supply is constrained and which public companies sit closest to the bottleneck.</p>
      </section>
      <section className="container page-section theme-page-grid">
        {themes.map((theme, index) => (
          <article className="theme-card" key={theme.slug}>
            <div className="theme-number">0{index + 1}</div>
            <div className="theme-card-head"><div><small>{theme.horizon}</small><h2>{theme.title}</h2></div><strong>{theme.score}</strong></div>
            <p>{theme.thesis}</p>
            <div className="ticker-links">{theme.tickers.map((ticker) => <Link key={ticker} href={`/stocks/${ticker}`}>{ticker}</Link>)}</div>
          </article>
        ))}
      </section>
    </main>
  );
}
