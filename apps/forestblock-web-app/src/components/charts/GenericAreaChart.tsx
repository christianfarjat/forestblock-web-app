"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { GenericChartProps } from "./types";

const GenericChart = <T,>({
  data,
  series,
  chartType = "area",
}: GenericChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height={300} style={{ padding: "10px" }}>
      {chartType === "bar" ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => `Mes: ${label}`}
            formatter={(value: number) => [`${value} tCO₂e`, "Emisiones"]}
          />
          {series.map((s) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name}
              fill={s.stroke}
            />
          ))}
        </BarChart>
      ) : (
        <AreaChart data={data}>
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s.dataKey}
                id={s.gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={s.stroke} stopOpacity={0.8} />
                <stop offset="95%" stopColor={s.stroke} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => `Mes: ${label}`}
            formatter={(value: number) => [`${value} tCO₂e`, "Emisiones"]}
          />
          {series.map((s) => (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.stroke}
              strokeWidth={2}
              fill={`url(#${s.gradientId})`}
            />
          ))}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
};

export default GenericChart;
