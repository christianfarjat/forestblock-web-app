'use client';

import React from 'react';

interface KPIWidgetProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  status?: 'on_track' | 'attention' | 'at_risk';
  target?: number | string;
  methodology?: string;
  className?: string;
}

const statusColors = {
  on_track: 'text-success',
  attention: 'text-warning',
  at_risk: 'text-danger',
};

export function KPIWidget({
  label,
  value,
  unit,
  trend,
  trendDirection = 'up',
  status = 'on_track',
  target,
  methodology,
  className = '',
}: KPIWidgetProps) {
  return (
    <div className={`bg-surface rounded-lg p-4 border border-border shadow-sm ${className}`}>
      <div className="space-y-3">
        {/* Label */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</p>
          {status && (
            <div className={`w-2 h-2 rounded-full ${statusColors[status]} opacity-70`} />
          )}
        </div>

        {/* Main value */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-text">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-sm text-text-muted">{unit}</span>}
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-medium ${
                trendDirection === 'up' ? 'text-success' : 'text-primary'
              }`}
            >
              {trendDirection === 'up' ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-text-faint">vs last month</span>
          </div>
        )}

        {/* Target */}
        {target !== undefined && (
          <div className="text-xs text-text-faint pt-1 border-t border-divider">
            Target: {typeof target === 'number' ? target.toLocaleString() : target}
          </div>
        )}

        {/* Methodology tooltip */}
        {methodology && (
          <div title={methodology} className="text-xs text-text-faint italic pt-1 border-t border-divider">
            {methodology}
          </div>
        )}
      </div>
    </div>
  );
}
