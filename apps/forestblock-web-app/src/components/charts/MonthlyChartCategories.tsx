"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
} from "recharts";

export interface MonthlyCategoryRecord {
  month: string;
  [seriesKey: string]: string | number;
}

interface MonthlyChartCategoriesProps {
  data: MonthlyCategoryRecord[];
  seriesKeys: string[];
  colors: { [key: string]: string };
}

const MonthlyChartCategories: React.FC<MonthlyChartCategoriesProps> = ({
  data,
  seriesKeys,
  colors,
}) => {
  const getGradientId = (key: string) => `color-${key.replace(/\s+/g, "-")}`;

  return (
    <ResponsiveContainer width="100%" height={300} style={{ padding: "10px" }}>
      <AreaChart data={data}>
        <defs>
          {seriesKeys.map((key) => {
            const gradientId = getGradientId(key);
            return (
              <linearGradient
                key={gradientId}
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={colors[key]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[key]} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>

        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip labelFormatter={(label) => `Mes: ${label}`} />
        <Legend verticalAlign="top" />

        {seriesKeys.map((key) => {
          const gradientId = getGradientId(key);
          return (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[key]}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MonthlyChartCategories;
