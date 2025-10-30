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
import RenderLegend from "./RenderLegend";

interface MonthlyChartProps {
  data: Array<{
    month: string;
    scope1: number;
    scope2: number;
    scope3: number;
  }>;
  colors: string[];
  debugFill?: boolean;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({
  data,
  colors,
  debugFill = false,
}) => {
  const colorForScope1 = colors[0 % colors.length];
  const colorForScope2 = colors[1 % colors.length];
  const colorForScope3 = colors[2 % colors.length];

  return (
    <ResponsiveContainer width="100%" height={300} style={{ padding: "10px" }}>
      <AreaChart data={data}>
        {!debugFill && (
          <defs>
            <linearGradient id="color-scope1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorForScope1} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colorForScope1} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color-scope2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorForScope2} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colorForScope2} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color-scope3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorForScope3} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colorForScope3} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => `Mes: ${label}`}
          formatter={(value: number, name: string) => [
            `${value} tCO2e`,
            `Alcance ${name.replace("scope", "")}`,
          ]}
        />
        <Legend
          content={<RenderLegend colors={colors} />}
          verticalAlign="top"
        />
        <Area
          type="monotone"
          dataKey="scope1"
          stroke={colorForScope1}
          strokeWidth={2}
          fill={debugFill ? colorForScope1 : "url(#color-scope1)"}
        />
        <Area
          type="monotone"
          dataKey="scope2"
          stroke={colorForScope2}
          strokeWidth={2}
          fill={debugFill ? colorForScope2 : "url(#color-scope2)"}
        />
        <Area
          type="monotone"
          dataKey="scope3"
          stroke={colorForScope3}
          strokeWidth={2}
          fill={debugFill ? colorForScope3 : "url(#color-scope3)"}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MonthlyChart;
