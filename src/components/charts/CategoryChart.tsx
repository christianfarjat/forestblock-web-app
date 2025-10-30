import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

interface CategoryChartProps {
  data: Array<{ name: string; emissions: number }>;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="vertical">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={180} />
      <Tooltip />
      <Bar dataKey="emissions" fill="#3B82F6" />
    </BarChart>
  </ResponsiveContainer>
);

export default CategoryChart;
