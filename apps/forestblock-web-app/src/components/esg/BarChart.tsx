'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  bars: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  title?: string;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

type BarChartLayout = 'vertical' | 'horizontal';

export function BarChart({
  data,
  bars,
  title,
  className = '',
  layout = 'horizontal',
}: BarChartProps) {
  return (
    <div className={`bg-surface rounded-lg border border-border p-5 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-text mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          layout={layout as BarChartLayout}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--c-divider))" />
          <XAxis
            type={layout === 'vertical' ? 'number' : 'category'}
            stroke="rgb(var(--c-text-muted))"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            dataKey={layout === 'vertical' ? 'scope' : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
            stroke="rgb(var(--c-text-muted))"
            style={{ fontSize: '12px' }}
            width={layout === 'vertical' ? 100 : undefined}
          />
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
            iconType="square"
          />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
              isAnimationActive={true}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
