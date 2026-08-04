import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header container">
      <Link href="/" className="brand">
        <span className="brand-mark">Y</span>
        <span>YOUNG BULL</span>
      </Link>
      <nav>
        <Link href="/stocks">Stocks</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/themes">Themes</Link>
        <Link href="/ai-news">AI News</Link>
        <Link href="/research">Research</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
