import "./stocks-expanded.css";
import { LiveUniverseTable } from "@/components/LiveUniverseTable";
import { SiteHeader } from "@/components/SiteHeader";
import { getUniverseScores } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StocksPage() {
  const result = await getUniverseScores(500).catch(() => ({
    as_of: null,
    stocks: [],
    message: "The scoring API could not be reached.",
  }));

  const isOldUniverse = result.stocks.length > 0 && result.stocks.length < 200;

  return (
    <main>
      <SiteHeader />

      <section className="page-hero container">
        <div className="eyebrow">LIVE STOCK INTELLIGENCE</div>
        <h1>The Young Bull Universe</h1>
        <p>
          Cross-sectional rankings across momentum, technical structure,
          fundamentals and thematic fit.
        </p>
      </section>

      <section className="container universe-summary-strip">
        <div>
          <span>SCORED STOCKS</span>
          <strong>{result.stocks.length}</strong>
        </div>
        <div>
          <span>LAST REFRESH</span>
          <strong>{result.as_of ?? "Not available"}</strong>
        </div>
        <div>
          <span>MODEL</span>
          <strong>25 / 25 / 30 / 20</strong>
        </div>
      </section>

      <section className="container page-section">
        {result.stocks.length === 0 && (
          <div className="universe-alert error">
            <strong>NO STORED SCORES</strong>
            <p>Run the Railway score-refresh service, then reload this page.</p>
          </div>
        )}

        {isOldUniverse && (
          <div className="universe-alert warning">
            <strong>THE DATABASE STILL CONTAINS THE OLD UNIVERSE</strong>
            <p>
              The frontend requested up to 500 stocks, but the API returned only
              {` ${result.stocks.length}`}. Run score-refresh after deploying the
              expanded backend universe.
            </p>
          </div>
        )}

        {result.stocks.length >= 200 && (
          <div className="universe-alert success">
            <strong>EXPANDED UNIVERSE ACTIVE</strong>
            <p>{result.stocks.length} stocks were returned from the latest scoring run.</p>
          </div>
        )}

        <LiveUniverseTable stocks={result.stocks} />
      </section>
    </main>
  );
}
