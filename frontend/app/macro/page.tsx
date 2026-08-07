import "./macro.css";
import { MacroChart } from "@/components/MacroChart";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

type MacroSeries = {
  id: string;
  label: string;
  unit: string;
  group: string;
  description: string;
  latest: { date: string; value: number } | null;
  history: { date: string; value: number }[];
};

async function getMacroData() {
  const response = await fetch(`${API_URL}/api/macro`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Macro API failed: ${response.status}`);
  return response.json() as Promise<{ series: MacroSeries[]; errors: Record<string, string>; source: string }>;
}

function formatLevel(series: MacroSeries) {
  if (!series.latest) return "N/A";
  if (series.unit === "%") return `${series.latest.value.toFixed(2)}%`;
  if (series.unit === "$ millions") return `$${(series.latest.value / 1_000_000).toFixed(2)}T`;
  return series.latest.value.toFixed(1);
}

export default async function MacroPage() {
  const data = await getMacroData();
  return (
    <main>
      <SiteHeader />
      <section className="page-hero container macro-hero">
        <div className="eyebrow">MACRO ENGINE · LIVE LEVELS</div>
        <h1>Macro Dashboard</h1>
        <p>The handful of macro variables that matter most for equity valuation, liquidity and risk appetite.</p>
        <div className="macro-cta-row">
          <a className="macro-primary-cta" href="https://macroengine.substack.com/subscribe" target="_blank" rel="noreferrer">SUBSCRIBE TO MACRO ENGINE →</a>
          <a className="macro-secondary-cta" href="https://macroengine.substack.com" target="_blank" rel="noreferrer">READ THE NEWSLETTER ↗</a>
        </div>
      </section>

      <section className="container macro-level-grid">
        {data.series.map((series) => (
          <article key={series.id}>
            <span>{series.label}</span>
            <strong>{formatLevel(series)}</strong>
            <small>{series.latest?.date ?? "No observation"}</small>
          </article>
        ))}
      </section>

      <section className="container macro-grid">
        {data.series.map((series) => (
          <article className="panel macro-panel" key={series.id}>
            <div className="macro-panel-heading">
              <div>
                <span className="eyebrow">{series.group}</span>
                <h2>{series.label}</h2>
                <p>{series.description}</p>
              </div>
              <strong>{formatLevel(series)}</strong>
            </div>
            <MacroChart history={series.history} unit={series.unit} />
          </article>
        ))}
      </section>

      <section className="container macro-source">Source: Federal Reserve Economic Data (FRED).</section>
    </main>
  );
}
