"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { date: string; value: number };
const ranges = { "1Y": 365, "3Y": 1095, "5Y": 1825 };

export function MacroChart({ history, unit }: { history: Point[]; unit: string }) {
  const [range, setRange] = useState<keyof typeof ranges>("3Y");
  const data = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - ranges[range]);
    return history.filter((row) => new Date(row.date) >= cutoff);
  }, [history, range]);

  const formatValue = (value: number) => {
    if (unit === "$ millions") return `$${(value / 1_000_000).toFixed(2)}T`;
    if (unit === "%") return `${value.toFixed(2)}%`;
    return value.toFixed(1);
  };

  return (
    <div className="macro-chart-shell">
      <div className="macro-chart-controls">
        {Object.keys(ranges).map((item) => (
          <button key={item} className={range === item ? "active" : ""} onClick={() => setRange(item as keyof typeof ranges)}>{item}</button>
        ))}
      </div>
      <div className="macro-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#292824" vertical={false} />
            <XAxis dataKey="date" minTickGap={42} tickLine={false} axisLine={false} tick={{ fill: "#8e8b82", fontSize: 10 }} />
            <YAxis width={64} tickLine={false} axisLine={false} tick={{ fill: "#8e8b82", fontSize: 10 }} tickFormatter={formatValue} domain={["auto", "auto"]} />
            <Tooltip formatter={(value) => formatValue(Number(value))} contentStyle={{ background: "#151513", border: "1px solid #4b4028" }} />
            <Line type="monotone" dataKey="value" stroke="#d8a63f" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
