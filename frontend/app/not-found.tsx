import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found container">
      <div className="eyebrow">404 · TICKER NOT FOUND</div>
      <h1>The market gave us nothing.</h1>
      <p>Check the ticker symbol and try again.</p>
      <Link href="/" className="button-link">RETURN HOME</Link>
    </main>
  );
}
