import Link from "next/link";
import { PriceChart } from "@/components/PriceChart";
import { getStock } from "@/lib/api";

type Props = {
  params: Promise<{ ticker: string }>;
};

function formatMoney(value: number | null, currency = "USD") {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLargeNumber(value: number | null) {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function StockPage({ params }: Props) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

const stock = await getStock(symbol);

  const positive = (stock.quote.change_percent ?? 0) >= 0;

  return (
    <main>
      <header className="site-header container">
        <Link href="/" className="brand">
          <span className="brand-mark">Y</span>
          <span>YOUNG BULL</span>
        </Link>
        <Link href="/" className="back-link">← RESEARCH HOME</Link>
      </header>

      <section className="stock-hero container">
        <div>
          <div className="eyebrow">COMPANY WORKBOOK · {symbol}</div>
          <h1>{stock.company.name}</h1>
          <p>{stock.company.sector} · {stock.company.industry}</p>
        </div>
        <div className="quote-block">
          <strong>{formatMoney(stock.quote.price, stock.quote.currency)}</strong>
          <span className={positive ? "positive" : "negative"}>
            {positive ? "+" : ""}
            {stock.quote.change_percent?.toFixed(2) ?? "0.00"}%
          </span>
        </div>
      </section>

      <section className="container metric-grid">
        <article className="metric-card">
          <span>MARKET CAP</span>
          <strong>{formatLargeNumber(stock.company.market_cap)}</strong>
        </article>
        <article className="metric-card">
          <span>52 WEEK HIGH</span>
          <strong>{formatMoney(stock.quote.year_high, stock.quote.currency)}</strong>
        </article>
        <article className="metric-card">
          <span>52 WEEK LOW</span>
          <strong>{formatMoney(stock.quote.year_low, stock.quote.currency)}</strong>
        </article>
        <article className="metric-card">
          <span>VOLUME</span>
          <strong>{formatLargeNumber(stock.quote.volume)}</strong>
        </article>
      </section>

      <section className="container workbook-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">PRICE ACTION</span>
              <h2>One-year history</h2>
            </div>
          </div>
          <PriceChart data={stock.history} />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">COMPANY SNAPSHOT</span>
              <h2>What it does</h2>
            </div>
          </div>
          <p className="description">
            {stock.company.description || "Company description unavailable."}
          </p>
          <dl className="detail-list">
            <div><dt>Exchange</dt><dd>{stock.company.exchange}</dd></div>
            <div><dt>Country</dt><dd>{stock.company.country}</dd></div>
            <div><dt>Employees</dt><dd>{formatLargeNumber(stock.company.employees)}</dd></div>
            <div><dt>Website</dt><dd>{stock.company.website || "N/A"}</dd></div>
          </dl>
        </article>
      </section>

      <footer className="container footer">
        <span>DATA FOR RESEARCH PURPOSES</span>
        <span>PRICES MAY BE DELAYED</span>
      </footer>
    </main>
  );
}
