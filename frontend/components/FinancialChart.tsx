"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = { period: string; revenue: number | null; netIncome: number | null; operatingIncome: number | null };

export function FinancialChart({ data }: { data: Row[] }) {
  const [metric, setMetric] = useState<"revenue" | "netIncome" | "operatingIncome">("revenue");
  const labels = { revenue: "Revenue", netIncome: "Net income", operatingIncome: "Operating income" };

  return (
    <div className="financial-chart-shell">
      <div className="chart-controls">
        <div>
          {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => (
            <button key={key} className={metric === key ? "active" : ""} onClick={() => setMetric(key)}>
              {labels[key]}
            </button>
          ))}
        </div>
      </div>
      <div className="financial-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#292824" vertical={false} />
            <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "#8e8b82", fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8e8b82", fontSize: 10 }} tickFormatter={(v) => `${(v / 1e9).toFixed(0)}B`} />
            <Tooltip formatter={(value) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(Number(value))} contentStyle={{ background: "#151513", border: "1px solid #4b4028" }} />
            <Bar dataKey={metric} fill="#d8a63f" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
