'use client';

import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title?: string;
  className?: string;
}

export function PieChart({ data, title, className = '' }: PieChartProps) {
  return (
    <div className={`bg-surface rounded-lg border border-border p-5 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-text mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--c-surface))',
              border: '1px solid rgb(var(--c-border))',
              borderRadius: '8px',
              color: 'rgb(var(--c-text))',
            }}
            formatter={(value) => [value.toLocaleString(), 'Emissions (tCO2e)']}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
