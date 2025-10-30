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
} from "recharts";

interface EvolutionData {
  month: string;
  currentYear: number;
  previousYear: number;
}

interface EvolutionChartProps {
  data: EvolutionData[];
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300} style={{ padding: "10px" }}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#89CCC5" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#89CCC5" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#E2B370" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#E2B370" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip
        labelFormatter={(label) => `Mes: ${label}`}
        formatter={(value: number) => [`${value} tCO2e`, "Emisiones"]}
      />
      <Area
        type="monotone"
        dataKey="currentYear"
        name="Periodo actual"
        stroke="#89CCC5"
        strokeWidth={2}
        fill="url(#colorCurrent)"
      />
      <Area
        type="monotone"
        dataKey="previousYear"
        name="Periodo anterior"
        stroke="#E2B370"
        strokeWidth={2}
        fill="url(#colorPrevious)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default EvolutionChart;
