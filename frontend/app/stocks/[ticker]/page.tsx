import Link from "next/link";
import { FinancialChart } from "@/components/FinancialChart";
import { PremiumPriceChart } from "@/components/PremiumPriceChart";
import { ScoreBars } from "@/components/ScoreBars";
import { ScoreRing } from "@/components/ScoreRing";
import { SiteHeader } from "@/components/SiteHeader";
import { getPremiumWorkbook, getScore, getStock } from "@/lib/api";
import { researchPosts, universe } from "@/lib/researchData";

type Props = { params: Promise<{ ticker: string }> };

const money = (value: number | null, currency = "USD") =>
  value == null ? "N/A" : new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
const compact = (value: number | null) =>
  value == null ? "N/A" : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
const ratio = (value: number | null | undefined) => value == null ? "N/A" : value.toFixed(2);
const percent = (value: number | null | undefined) => value == null ? "N/A" : `${(value * 100).toFixed(1)}%`;
const parseNum = (value?: string) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const dynamic = "force-dynamic";

export default async function StockPage({ params }: Props) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();
  const [stock, score, premium] = await Promise.all([
    getStock(symbol),
    getScore(symbol),
    getPremiumWorkbook(symbol),
  ]);

  const metadata = universe.find((x) => x.ticker === symbol);
  const fallback = { momentum: 50, technicals: 50, fundamentals: 50, thematic_fit: metadata?.thematicFit ?? 50, overall: 50 };
  const model = score ?? fallback;
  const positive = (stock.quote.change_percent ?? 0) >= 0;
  const relatedResearch = researchPosts.filter((post) => post.tickers.includes(symbol));

  const quarterlies = (premium?.datasets.income.quarterlyReports ?? []).slice(0, 8).reverse();
  const financialRows = quarterlies.map((row) => ({
    period: row.fiscalDateEnding?.slice(0, 7) ?? "",
    revenue: parseNum(row.totalRevenue),
    netIncome: parseNum(row.netIncome),
    operatingIncome: parseNum(row.operatingIncome),
  }));

  const earnings = (premium?.datasets.earnings.quarterlyEarnings ?? []).slice(0, 8);
  const overview = premium?.datasets.overview ?? {};

  return (
    <main>
      <SiteHeader />

      <section className="stock-hero container">
        <div>
          <div className="eyebrow">PREMIUM COMPANY WORKBOOK · {symbol}</div>
          <h1>{stock.company.name}</h1>
          <p>{metadata?.theme || stock.company.sector} · {stock.company.industry}</p>
        </div>
        <div className="quote-score">
          <div className="quote-block">
            <strong>{money(stock.quote.price, stock.quote.currency)}</strong>
            <span className={positive ? "positive" : "negative"}>{positive ? "+" : ""}{stock.quote.change_percent?.toFixed(2) ?? "0.00"}%</span>
          </div>
          <ScoreRing score={Math.round(model.overall)} />
        </div>
      </section>

      <section className="container metric-grid six">
        <article className="metric-card"><span>MARKET CAP</span><strong>{compact(stock.company.market_cap)}</strong></article>
        <article className="metric-card"><span>FORWARD P/E</span><strong>{overview.ForwardPE || ratio(stock.fundamentals.forward_pe)}</strong></article>
        <article className="metric-card"><span>PEG RATIO</span><strong>{overview.PEGRatio || "N/A"}</strong></article>
        <article className="metric-card"><span>REVENUE GROWTH</span><strong>{percent(stock.fundamentals.revenue_growth)}</strong></article>
        <article className="metric-card"><span>OPERATING MARGIN</span><strong>{percent(stock.fundamentals.operating_margin)}</strong></article>
        <article className="metric-card"><span>52W RANGE</span><strong>{money(stock.quote.year_low)} – {money(stock.quote.year_high)}</strong></article>
      </section>

      <section className="container workbook-tabs">
        <a href="#chart">Chart</a><a href="#score">Score</a><a href="#financials">Financials</a>
        <a href="#earnings">Earnings</a><a href="#thesis">Thesis</a><a href="#files">Files</a>
      </section>

      <section id="chart" className="container page-section">
        <article className="panel premium-main-panel">
          <div className="panel-heading"><div><span className="eyebrow">INTERACTIVE PRICE CHART</span><h2>Trend and moving averages</h2></div></div>
          <PremiumPriceChart data={stock.history} />
        </article>
      </section>

      <section id="score" className="container two-column-section">
        <article className="panel">
          <span className="eyebrow">LIVE MODEL SCORE</span><h2 className="panel-title">Cross-sectional ranking</h2>
          <ScoreBars scores={{
            Momentum: Math.round(model.momentum),
            Technicals: Math.round(model.technicals),
            Fundamentals: Math.round(model.fundamentals),
            "Thematic Fit": Math.round(model.thematic_fit),
          }} />
          <p className="small-note">Scores are percentile-ranked against the Young Bull universe and stored by date in PostgreSQL.</p>
        </article>
        <article id="thesis" className="panel">
          <span className="eyebrow">YOUNG BULL THESIS</span><h2 className="panel-title">{metadata?.theme || "Investment thesis"}</h2>
          <p className="description">{metadata?.note || "Add the live thesis, why now, catalysts, risks and invalidation conditions here."}</p>
          <div className="thesis-box"><strong>MODEL READ</strong><p>Overall score: {model.overall.toFixed(1)}. The score updates after each scheduled backend refresh.</p></div>
          <div className="thesis-box"><strong>KEY RISK</strong><p>Watch valuation, earnings revisions and any deterioration in the underlying thematic demand signal.</p></div>
        </article>
      </section>

      <section id="financials" className="container page-section">
        <div className="section-heading"><div><div className="eyebrow">QUARTERLY FUNDAMENTALS</div><h2>Revenue and earnings power</h2></div></div>
        {financialRows.length > 0 ? <FinancialChart data={financialRows} /> : <div className="empty-data">Alpha Vantage fundamentals are not cached yet.</div>}
        <div className="fundamental-grid">
          <div><span>TRAILING P/E</span><strong>{overview.TrailingPE || ratio(stock.fundamentals.trailing_pe)}</strong></div>
          <div><span>PRICE / SALES</span><strong>{overview.PriceToSalesRatioTTM || ratio(stock.fundamentals.price_to_sales)}</strong></div>
          <div><span>EV / EBITDA</span><strong>{overview.EVToEBITDA || ratio(stock.fundamentals.enterprise_to_ebitda)}</strong></div>
          <div><span>BOOK VALUE</span><strong>{overview.BookValue || "N/A"}</strong></div>
          <div><span>GROSS MARGIN</span><strong>{percent(stock.fundamentals.gross_margin)}</strong></div>
          <div><span>PROFIT MARGIN</span><strong>{overview.ProfitMargin ? `${(Number(overview.ProfitMargin) * 100).toFixed(1)}%` : percent(stock.fundamentals.profit_margin)}</strong></div>
          <div><span>RETURN ON EQUITY</span><strong>{overview.ReturnOnEquityTTM ? `${(Number(overview.ReturnOnEquityTTM) * 100).toFixed(1)}%` : percent(stock.fundamentals.return_on_equity)}</strong></div>
          <div><span>FREE CASH FLOW</span><strong>{compact(stock.fundamentals.free_cash_flow)}</strong></div>
        </div>
      </section>

      <section id="earnings" className="container page-section">
        <div className="section-heading"><div><div className="eyebrow">EARNINGS HISTORY</div><h2>Beat, miss and estimate trend</h2></div></div>
        <div className="earnings-grid">
          {earnings.map((row, index) => (
            <article key={`${row.fiscalDateEnding}-${index}`}>
              <span>{row.fiscalDateEnding}</span>
              <strong>EPS {row.reportedEPS ?? "N/A"}</strong>
              <small>Estimate {row.estimatedEPS ?? "N/A"}</small>
              <b className={Number(row.surprisePercentage) >= 0 ? "positive" : "negative"}>
                {row.surprisePercentage ? `${row.surprisePercentage}% surprise` : "No surprise data"}
              </b>
            </article>
          ))}
        </div>
      </section>

      <section className="container two-column-section">
        <article className="panel">
          <span className="eyebrow">COMPANY SNAPSHOT</span><h2 className="panel-title">What it does</h2>
          <p className="description">{stock.company.description || overview.Description || "Description unavailable."}</p>
        </article>
        <article className="panel">
          <span className="eyebrow">RELATED RESEARCH</span><h2 className="panel-title">Young Bull coverage</h2>
          {relatedResearch.length ? relatedResearch.map((post) => (
            <div className="related-post" key={post.title}><small>{post.date} · {post.theme}</small><h3>{post.title}</h3></div>
          )) : <p className="description">No linked research yet.</p>}
        </article>
      </section>

      <section id="files" className="container page-section">
        <div className="section-heading"><div><div className="eyebrow">PRIMARY SOURCES</div><h2>Files and filings</h2></div></div>
        <div className="file-grid">
          <a href={stock.files.sec_company} target="_blank" rel="noreferrer"><strong>SEC FILINGS</strong><span>10-K, 10-Q, 8-K, proxy and ownership filings</span></a>
          <a href={stock.files.yahoo_profile} target="_blank" rel="noreferrer"><strong>MARKET PROFILE</strong><span>Yahoo Finance profile and market data</span></a>
          {stock.company.website && <a href={stock.company.website} target="_blank" rel="noreferrer"><strong>INVESTOR WEBSITE</strong><span>Company investor materials and presentations</span></a>}
        </div>
      </section>
    </main>
  );
}
