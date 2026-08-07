import { SiteHeader } from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero container">
        <div className="eyebrow">ABOUT YOUNG BULL</div>
        <h1>Real research. Real positions.</h1>
        <p>Young Bull documents the AI investing revolution through a public portfolio and bottom-up research into the companies building its physical infrastructure.</p>
      </section>
      <section className="container about-grid page-section">
        <article><span>01</span><h2>Start below the headline</h2><p>The obvious stock is rarely the whole trade. Research follows the dependency chain into networking, power, cooling, memory, materials and equipment.</p></article>
        <article><span>02</span><h2>Connect research to positions</h2><p>Every portfolio holding should have a live thesis, identifiable risks and a clear reason it still deserves capital.</p></article>
        <article><span>03</span><h2>Let the work compound</h2><p>Articles become a searchable database instead of disappearing into a chronological feed.</p></article>
      </section>
      <section className="container page-section">
  <article className="panel">
    <span className="eyebrow">QUESTIONS / TICKER REQUESTS</span>
    <h2 className="panel-title">Help improve the terminal</h2>
    <p className="description">
      Questions about the site, data or scoring methodology? Want a ticker
      added to the ranked universe? Message Macro Engine on Substack.
    </p>
    <a className="text-link" href="https://macroengine.substack.com" target="_blank" rel="noreferrer">
      MESSAGE MACRO ENGINE ON SUBSTACK →
    </a>
  </article>
</section>
    </main>
  );
}
