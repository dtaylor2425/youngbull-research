import { SiteHeader } from "@/components/SiteHeader";
import { UniverseTable } from "@/components/UniverseTable";
import { universe } from "@/lib/researchData";

export default function StocksPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero container">
        <div className="eyebrow">STOCK INTELLIGENCE</div>
        <h1>The Young Bull Universe</h1>
        <p>{universe.length} companies across compute, networking, power, memory, physical AI, space and strategic materials.</p>
      </section>
      <section className="container page-section">
        <UniverseTable />
      </section>
    </main>
  );
}
