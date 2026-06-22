/* eslint-disable @typescript-eslint/no-explicit-any */

import { ScopeData } from "@/app/dashboard/types";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ScopeChartProps {
  data: ScopeData[];
  colors: string[];
}

const CustomLegend = (props: any) => {
  const { payload, colors } = props;
  const newPayload = payload.map((entry: any, index: number) => ({
    ...entry,
    color: colors[index % colors.length],
  }));

  const total = newPayload.reduce(
    (acc: number, cur: any) => acc + cur.payload.value,
    0
  );

  return (
    <div style={{ marginTop: "1rem", width: "100%" }}>
      {newPayload.map((entry: any, index: number) => {
        const scopeName = entry.value;
        const rawValue = entry.payload.value;
        const scopeColor = entry.color;

        const percentage = total > 0 ? (rawValue / total) * 100 : 0;
        const formattedValue =
          percentage.toLocaleString("es-ES", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }) + " %";

        return (
          <div
            key={`legend-item-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: scopeColor,
                  marginRight: "0.5rem",
                }}
              />
              <span>{scopeName}</span>
            </div>
            <span className="text-gray-600">{formattedValue}</span>
          </div>
        );
      })}
    </div>
  );
};

const ScopeChart: React.FC<ScopeChartProps> = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          label={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>

        <Tooltip formatter={(value: number) => value.toLocaleString("es-ES")} />

        <Legend
          verticalAlign="bottom"
          align="center"
          content={<CustomLegend colors={colors} />}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ScopeChart;
