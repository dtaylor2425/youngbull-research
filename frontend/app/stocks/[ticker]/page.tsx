import Link from "next/link";
import { PriceChart } from "@/components/PriceChart";
import { ScoreBars } from "@/components/ScoreBars";
import { ScoreRing } from "@/components/ScoreRing";
import { SiteHeader } from "@/components/SiteHeader";
import { getStock } from "@/lib/api";
import { pseudoScore, researchPosts, universe } from "@/lib/researchData";

type Props = { params: Promise<{ ticker: string }> };

function formatMoney(value: number | null, currency = "USD") {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}
function compact(value: number | null) {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}
function ratio(value: number | null | undefined) {
  return value == null ? "N/A" : value.toFixed(2);
}
function percent(value: number | null | undefined) {
  return value == null ? "N/A" : `${(value * 100).toFixed(1)}%`;
}

export default async function StockPage({ params }: Props) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();
  const stock = await getStock(symbol);
  const metadata = universe.find((x) => x.ticker === symbol);
  const thematicFit = metadata?.thematicFit ?? 75;
  const score = pseudoScore(symbol, thematicFit);
  const positive = (stock.quote.change_percent ?? 0) >= 0;
  const relatedResearch = researchPosts.filter((post) => post.tickers.includes(symbol));

  return (
    <main>
      <SiteHeader />
      <section className="stock-hero container">
        <div>
          <div className="eyebrow">COMPANY WORKBOOK · {symbol}</div>
          <h1>{stock.company.name}</h1>
          <p>{metadata?.theme || stock.company.sector} · {stock.company.industry}</p>
        </div>
        <div className="quote-score">
          <div className="quote-block">
            <strong>{formatMoney(stock.quote.price, stock.quote.currency)}</strong>
            <span className={positive ? "positive" : "negative"}>{positive ? "+" : ""}{stock.quote.change_percent?.toFixed(2) ?? "0.00"}%</span>
          </div>
          <ScoreRing score={score.overall} />
        </div>
      </section>

      <section className="container metric-grid six">
        <article className="metric-card"><span>MARKET CAP</span><strong>{compact(stock.company.market_cap)}</strong></article>
        <article className="metric-card"><span>52W HIGH</span><strong>{formatMoney(stock.quote.year_high, stock.quote.currency)}</strong></article>
        <article className="metric-card"><span>52W LOW</span><strong>{formatMoney(stock.quote.year_low, stock.quote.currency)}</strong></article>
        <article className="metric-card"><span>VOLUME</span><strong>{compact(stock.quote.volume)}</strong></article>
        <article className="metric-card"><span>FORWARD P/E</span><strong>{ratio(stock.fundamentals.forward_pe)}</strong></article>
        <article className="metric-card"><span>REVENUE GROWTH</span><strong>{percent(stock.fundamentals.revenue_growth)}</strong></article>
      </section>

      <section className="container workbook-tabs">
        <a href="#overview">Overview</a><a href="#scores">Scores</a><a href="#fundamentals">Fundamentals</a><a href="#technicals">Technicals</a><a href="#thesis">Thesis</a><a href="#files">Files</a>
      </section>

      <section id="overview" className="container workbook-grid">
        <article className="panel chart-panel">
          <div className="panel-heading"><div><span className="eyebrow">PRICE ACTION</span><h2>One-year history</h2></div></div>
          <PriceChart data={stock.history} />
        </article>
        <article className="panel">
          <div className="panel-heading"><div><span className="eyebrow">COMPANY SNAPSHOT</span><h2>What it does</h2></div></div>
          <p className="description">{stock.company.description || "Company description unavailable."}</p>
          <dl className="detail-list">
            <div><dt>Exchange</dt><dd>{stock.company.exchange}</dd></div>
            <div><dt>Country</dt><dd>{stock.company.country}</dd></div>
            <div><dt>Employees</dt><dd>{compact(stock.company.employees)}</dd></div>
            <div><dt>Website</dt><dd>{stock.company.website || "N/A"}</dd></div>
          </dl>
        </article>
      </section>

      <section id="scores" className="container two-column-section">
        <article className="panel">
          <span className="eyebrow">YOUNG BULL SCORE</span><h2 className="panel-title">Model breakdown</h2>
          <ScoreBars scores={{ Momentum: score.momentum, Technicals: score.technicals, Fundamentals: score.fundamentals, "Thematic Fit": score.thematicFit }} />
          <p className="small-note">Current v1 weighting: 25% momentum, 25% technicals, 30% fundamentals and 20% thematic fit.</p>
        </article>
        <article id="thesis" className="panel">
          <span className="eyebrow">INVESTMENT THESIS</span><h2 className="panel-title">{metadata?.theme || "Company Thesis"}</h2>
          <p className="description">{metadata?.note || "A structured Young Bull thesis will be added here, including why now, catalysts, risks and invalidation conditions."}</p>
          <div className="thesis-box"><strong>WHY NOW</strong><p>Score changes, earnings revisions and theme-level catalysts will populate this section as the data model expands.</p></div>
          <div className="thesis-box"><strong>KEY RISK</strong><p>Valuation compression, execution risk and a breakdown in the underlying thematic demand signal.</p></div>
        </article>
      </section>

      <section id="fundamentals" className="container page-section">
        <div className="section-heading"><div><div className="eyebrow">FUNDAMENTAL OUTPUT</div><h2>Financial quality and growth</h2></div></div>
        <div className="fundamental-grid">
          <div><span>TRAILING P/E</span><strong>{ratio(stock.fundamentals.trailing_pe)}</strong></div>
          <div><span>FORWARD P/E</span><strong>{ratio(stock.fundamentals.forward_pe)}</strong></div>
          <div><span>PRICE / SALES</span><strong>{ratio(stock.fundamentals.price_to_sales)}</strong></div>
          <div><span>EV / EBITDA</span><strong>{ratio(stock.fundamentals.enterprise_to_ebitda)}</strong></div>
          <div><span>REVENUE GROWTH</span><strong>{percent(stock.fundamentals.revenue_growth)}</strong></div>
          <div><span>EARNINGS GROWTH</span><strong>{percent(stock.fundamentals.earnings_growth)}</strong></div>
          <div><span>GROSS MARGIN</span><strong>{percent(stock.fundamentals.gross_margin)}</strong></div>
          <div><span>OPERATING MARGIN</span><strong>{percent(stock.fundamentals.operating_margin)}</strong></div>
          <div><span>PROFIT MARGIN</span><strong>{percent(stock.fundamentals.profit_margin)}</strong></div>
          <div><span>RETURN ON EQUITY</span><strong>{percent(stock.fundamentals.return_on_equity)}</strong></div>
          <div><span>FREE CASH FLOW</span><strong>{compact(stock.fundamentals.free_cash_flow)}</strong></div>
          <div><span>TOTAL DEBT</span><strong>{compact(stock.fundamentals.total_debt)}</strong></div>
        </div>
      </section>

      <section id="technicals" className="container two-column-section">
        <article className="panel">
          <span className="eyebrow">TECHNICAL OUTPUT</span><h2 className="panel-title">Trend structure</h2>
          <dl className="detail-list">
            <div><dt>20-day return</dt><dd>{stock.technicals.return_20d?.toFixed(1) ?? "N/A"}%</dd></div>
            <div><dt>60-day return</dt><dd>{stock.technicals.return_60d?.toFixed(1) ?? "N/A"}%</dd></div>
            <div><dt>200-day return</dt><dd>{stock.technicals.return_200d?.toFixed(1) ?? "N/A"}%</dd></div>
            <div><dt>Distance from 52W high</dt><dd>{stock.technicals.distance_from_high?.toFixed(1) ?? "N/A"}%</dd></div>
            <div><dt>50-day moving average</dt><dd>{formatMoney(stock.technicals.sma_50, stock.quote.currency)}</dd></div>
            <div><dt>200-day moving average</dt><dd>{formatMoney(stock.technicals.sma_200, stock.quote.currency)}</dd></div>
          </dl>
        </article>
        <article className="panel">
          <span className="eyebrow">RELATED RESEARCH</span><h2 className="panel-title">Young Bull coverage</h2>
          {relatedResearch.length ? relatedResearch.map((post) => (
            <div className="related-post" key={post.title}><small>{post.date} · {post.theme}</small><h3>{post.title}</h3></div>
          )) : <p className="description">No published research has been linked to this ticker yet.</p>}
        </article>
      </section>

      <section id="files" className="container page-section">
        <div className="section-heading"><div><div className="eyebrow">RELEVANT FILES</div><h2>Primary-source research</h2></div></div>
        <div className="file-grid">
          <a href={stock.files.sec_company} target="_blank" rel="noreferrer"><strong>SEC COMPANY FILINGS</strong><span>10-K, 10-Q, 8-K and ownership filings</span></a>
          <a href={stock.files.yahoo_profile} target="_blank" rel="noreferrer"><strong>YAHOO FINANCE PROFILE</strong><span>Quote, company profile and market data</span></a>
          {stock.company.website && <a href={stock.company.website} target="_blank" rel="noreferrer"><strong>INVESTOR WEBSITE</strong><span>Company materials and investor relations</span></a>}
        </div>
      </section>
    </main>
  );
}
