"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "@/lib/types";

export function PriceChart({ data }: { data: HistoryPoint[] }) {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d8a63f" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#d8a63f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2a2a27" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8e8b82", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={35}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#8e8b82", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={58}
          />
          <Tooltip
            contentStyle={{
              background: "#151513",
              border: "1px solid #3a3528",
              borderRadius: 4,
            }}
            labelStyle={{ color: "#a9a59a" }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#d8a63f"
            fill="url(#priceFill)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
