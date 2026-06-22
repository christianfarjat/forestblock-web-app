"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomLegend from "./CustomLegend";
import { GenericDonutChartProps } from "./types";

const GenericDonutChart: React.FC<GenericDonutChartProps> = ({
  data,
  innerRadius = 60,
  outerRadius = 80,
}) => {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          label={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => value.toLocaleString("es-ES")} />
        <Legend
          verticalAlign="bottom"
          align="center"
          content={
            <CustomLegend
              payload={data.map((entry) => ({
                value: entry.name,
                payload: { value: entry.value },
                color: entry.color,
              }))}
            />
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GenericDonutChart;
