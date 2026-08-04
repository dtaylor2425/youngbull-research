import Link from "next/link";
import { StockSearch } from "@/components/StockSearch";

const featured = [
  {
    ticker: "NVDA",
    title: "The compute engine",
    note: "Accelerated computing, networking and the center of AI capital spending.",
  },
  {
    ticker: "VRT",
    title: "The physical bottleneck",
    note: "Power and cooling infrastructure required to turn chips into usable compute.",
  },
  {
    ticker: "ALAB",
    title: "The connectivity layer",
    note: "Data-center connectivity and memory architecture as systems scale.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header container">
        <Link href="/" className="brand">
          <span className="brand-mark">Y</span>
          <span>YOUNG BULL</span>
        </Link>
        <nav>
          <Link href="#research">Research</Link>
          <Link href="#watchlist">Watchlist</Link>
          <Link href="#about">About</Link>
        </nav>
      </header>

      <section className="hero container">
        <div className="eyebrow">THE PHYSICAL LAYER OF AI</div>
        <h1>
          Research the companies
          <span> building the future.</span>
        </h1>
        <p>
          Stock research centered on AI infrastructure, supply-chain bottlenecks
          and the businesses converting capital spending into earnings.
        </p>
        <StockSearch />
      </section>

      <section className="market-strip">
        <div className="container strip-grid">
          <div>
            <span>FOCUS</span>
            <strong>AI Infrastructure</strong>
          </div>
          <div>
            <span>STYLE</span>
            <strong>Bottom-up Research</strong>
          </div>
          <div>
            <span>DATA</span>
            <strong>Yahoo Finance MVP</strong>
          </div>
          <div>
            <span>STATUS</span>
            <strong className="live">Live Prototype</strong>
          </div>
        </div>
      </section>

      <section id="research" className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">RESEARCH TERMINAL</div>
            <h2>Start with the stocks that matter.</h2>
          </div>
          <span className="section-index">01</span>
        </div>

        <div className="research-grid">
          {featured.map((stock) => (
            <Link
              href={`/stocks/${stock.ticker}`}
              className="research-card"
              key={stock.ticker}
            >
              <div className="card-top">
                <span className="ticker">{stock.ticker}</span>
                <span className="arrow">↗</span>
              </div>
              <h3>{stock.title}</h3>
              <p>{stock.note}</p>
              <div className="card-footer">OPEN WORKBOOK</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="watchlist" className="thesis-section">
        <div className="container thesis-grid">
          <div>
            <div className="eyebrow">THE CORE IDEA</div>
            <h2>Do not stop at the headline stock.</h2>
          </div>
          <p>
            The largest opportunities often sit one layer below the obvious
            trade: power, cooling, memory, networking, materials and specialized
            equipment. This platform is being built to map those dependencies
            and turn them into investable research.
          </p>
        </div>
      </section>

      <footer id="about" className="container footer">
        <span>YOUNG BULL RESEARCH</span>
        <span>REAL MONEY · REAL POSITIONS · REAL RECEIPTS</span>
      </footer>
    </main>
  );
}
