import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header container">
      <Link href="/" className="brand" aria-label="Young Bull home">
        <span className="brand-mark brand-mark-yb">YB</span>
        <span>YOUNG BULL</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/stocks">Stocks</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/themes">Themes</Link>

        <details className="nav-dropdown">
          <summary>Intelligence</summary>
          <div className="nav-dropdown-menu">
            <Link href="/ai-news">
              <strong>AI News</strong>
              <span>Stories moving the AI stack</span>
            </Link>
            <Link href="/research">
              <strong>Research</strong>
              <span>Young Bull articles and deep dives</span>
            </Link>
            <Link href="/macro">
            <strong>Macro</strong>
            <span>Rates, liquidity, credit and macro levels</span>
            </Link>
          </div>
        </details>

        <Link href="/about">About</Link>
      </nav>

      <details className="mobile-nav">
        <summary aria-label="Open navigation">Menu</summary>
        <div>
          <Link href="/stocks">Stocks</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/themes">Themes</Link>
          <Link href="/ai-news">AI News</Link>
          <Link href="/research">Research</Link>
          <Link href="/about">About</Link>
        </div>
      </details>
    </header>
  );
}
