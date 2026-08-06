"use client";

import { useMemo, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, Line, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";
import type { HistoryPoint } from "@/lib/types";

const ranges = [
  { label: "1M", days: 22 },
  { label: "3M", days: 66 },
  { label: "6M", days: 132 },
  { label: "1Y", days: 260 },
  { label: "MAX", days: 10000 },
];

function movingAverage(data: HistoryPoint[], length: number) {
  return data.map((point, index) => {
    if (index + 1 < length) return { ...point, [`sma${length}`]: null };
    const window = data.slice(index + 1 - length, index + 1);
    const average = window.reduce((sum, row) => sum + row.close, 0) / length;
    return { ...point, [`sma${length}`]: Number(average.toFixed(2)) };
  });
}

export function PremiumPriceChart({ data }: { data: HistoryPoint[] }) {
  const [range, setRange] = useState("1Y");
  const [show50, setShow50] = useState(true);
  const [show200, setShow200] = useState(false);

  const chartData = useMemo(() => {
    const selected = ranges.find((item) => item.label === range) ?? ranges[3];
    const sliced = data.slice(-selected.days);
    let enriched: any[] = movingAverage(sliced, 50);
    if (show200) {
      const fullWith200 = movingAverage(data, 200);
      const lookup = new Map(fullWith200.map((row: any) => [row.date, row.sma200]));
      enriched = enriched.map((row) => ({ ...row, sma200: lookup.get(row.date) ?? null }));
    }
    return enriched;
  }, [data, range, show200]);

  const latest = chartData.at(-1)?.close ?? 0;

  return (
    <div className="premium-chart-shell">
      <div className="chart-controls">
        <div>
          {ranges.map((item) => (
            <button className={range === item.label ? "active" : ""} key={item.label} onClick={() => setRange(item.label)}>
              {item.label}
            </button>
          ))}
        </div>
        <div>
          <button className={show50 ? "active" : ""} onClick={() => setShow50(!show50)}>50D</button>
          <button className={show200 ? "active" : ""} onClick={() => setShow200(!show200)}>200D</button>
        </div>
      </div>
      <div className="premium-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="premiumPriceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d8a63f" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#d8a63f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#292824" vertical={false} />
            <XAxis dataKey="date" minTickGap={45} tickLine={false} axisLine={false} tick={{ fill: "#8e8b82", fontSize: 10 }} />
            <YAxis domain={["auto", "auto"]} width={58} tickLine={false} axisLine={false} tick={{ fill: "#8e8b82", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#151513", border: "1px solid #4b4028" }} />
            <ReferenceLine y={latest} stroke="#555249" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="close" stroke="#d8a63f" strokeWidth={2} fill="url(#premiumPriceFill)" dot={false} />
            {show50 && <Line type="monotone" dataKey="sma50" stroke="#bdb8aa" strokeWidth={1.2} dot={false} connectNulls />}
            {show200 && <Line type="monotone" dataKey="sma200" stroke="#77736b" strokeWidth={1.2} dot={false} connectNulls />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
