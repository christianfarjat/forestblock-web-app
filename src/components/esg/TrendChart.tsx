'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendChartProps {
  data: Array<Record<string, string | number>>;
  lines: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  title?: string;
  className?: string;
}

export function TrendChart({ data, lines, title, className = '' }: TrendChartProps) {
  return (
    <div className={`bg-surface rounded-lg border border-border p-5 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-text mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--c-divider))" />
          <XAxis
            dataKey="month"
            stroke="rgb(var(--c-text-muted))"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="rgb(var(--c-text-muted))" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--c-surface))',
              border: '1px solid rgb(var(--c-border))',
              borderRadius: '8px',
              color: 'rgb(var(--c-text))',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
            iconType="line"
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
