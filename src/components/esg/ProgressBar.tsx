'use client';

import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  status?: 'on_track' | 'attention' | 'at_risk';
  className?: string;
}

const statusConfig = {
  on_track: 'bg-success',
  attention: 'bg-warning',
  at_risk: 'bg-danger',
};

export function ProgressBar({
  label,
  current,
  target,
  unit = '%',
  status = 'on_track',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text">{label}</label>
        <span className="text-sm font-semibold text-text">
          {current}{unit} / {target}{unit}
        </span>
      </div>
      <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
        <div
          className={`h-full ${statusConfig[status]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
