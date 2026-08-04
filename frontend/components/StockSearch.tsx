"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function StockSearch() {
  const [ticker, setTicker] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase().replace(/[^A-Z0-9.-]/g, "");
    if (cleanTicker) router.push(`/stocks/${cleanTicker}`);
  }

  return (
    <form className="stock-search" onSubmit={submit}>
      <label htmlFor="ticker">OPEN A COMPANY WORKBOOK</label>
      <div>
        <input
          id="ticker"
          value={ticker}
          onChange={(event) => setTicker(event.target.value)}
          placeholder="NVDA"
          aria-label="Ticker symbol"
          autoComplete="off"
          maxLength={12}
        />
        <button type="submit">RESEARCH STOCK</button>
      </div>
    </form>
  );
}
