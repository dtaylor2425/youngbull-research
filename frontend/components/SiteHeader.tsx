import Link from "next/link";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Young Bull home">
        <span className={styles.mark}>YB</span>
        <span className={styles.brandText}>Young Bull</span>
      </Link>

      <nav className={styles.desktopNav} aria-label="Primary navigation">
        <Link href="/stocks">Stocks</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/themes">Themes</Link>

        <details className={styles.dropdown}>
          <summary className={styles.dropdownSummary}>Intelligence</summary>

          <div className={styles.dropdownMenu}>
            <Link href="/macro">
              <strong>Macro</strong>
              <span>Rates, liquidity, credit and macro levels</span>
            </Link>

            <Link href="/ai-news">
              <strong>AI News</strong>
              <span>Stories moving the AI stack</span>
            </Link>

            <Link href="/research">
              <strong>Research</strong>
              <span>Young Bull articles and deep dives</span>
            </Link>
          </div>
        </details>

        <Link href="/about">About</Link>
      </nav>

      <details className={styles.mobileNav}>
        <summary className={styles.mobileSummary} aria-label="Open navigation">
          Menu
        </summary>

        <div className={styles.mobileMenu}>
          <Link href="/stocks">Stocks</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/themes">Themes</Link>
          <Link href="/macro">Macro</Link>
          <Link href="/ai-news">AI News</Link>
          <Link href="/research">Research</Link>
          <Link href="/about">About</Link>
        </div>
      </details>
    </header>
  );
}
