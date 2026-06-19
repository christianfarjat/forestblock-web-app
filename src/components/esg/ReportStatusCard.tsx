'use client';

import React from 'react';

interface ReportStatusCardProps {
  framework: string;
  name: string;
  period: string;
  coverage: number;
  status: 'in_progress' | 'review' | 'published';
  dueDate: string;
  daysLeft: number;
  pillars: string[];
  lastUpdated: string;
  className?: string;
}

const statusConfig = {
  in_progress: { bg: 'bg-info/10', text: 'text-info', label: 'In Progress' },
  review: { bg: 'bg-warning/10', text: 'text-warning', label: 'In Review' },
  published: { bg: 'bg-success/10', text: 'text-success', label: 'Published' },
};

const pillarConfig: Record<string, { label: string; bg: string; text: string }> = {
  environmental: { label: 'E', bg: 'bg-primary-soft', text: 'text-primary' },
  social: { label: 'S', bg: 'bg-secondary-soft', text: 'text-secondary' },
  governance: { label: 'G', bg: 'bg-accent-soft', text: 'text-accent' },
};

export function ReportStatusCard({
  framework,
  name,
  period,
  coverage,
  status,
  dueDate,
  daysLeft,
  pillars,
  lastUpdated,
  className = '',
}: ReportStatusCardProps) {
  const statusCfg = statusConfig[status];

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-sm p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-primary-soft text-primary rounded text-xs font-semibold">
              {framework}
            </span>
            <span className="text-xs text-text-faint">{period}</span>
          </div>
          <h3 className="font-semibold text-text mt-2">{name}</h3>
        </div>
        <div className={`${statusCfg.bg} ${statusCfg.text} px-2.5 py-1 rounded-full text-xs font-medium shrink-0`}>
          {statusCfg.label}
        </div>
      </div>

      {/* Pillars covered */}
      <div className="flex items-center gap-1.5">
        {pillars.map((p) => {
          const cfg = pillarConfig[p];
          if (!cfg) return null;
          return (
            <span
              key={p}
              className={`${cfg.bg} ${cfg.text} w-5 h-5 rounded flex items-center justify-center text-xs font-bold`}
            >
              {cfg.label}
            </span>
          );
        })}
      </div>

      {/* Coverage bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-text-muted">Coverage</span>
          <span className="text-xs font-bold text-text">{coverage}%</span>
        </div>
        <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${coverage}%` }} />
        </div>
      </div>

      {/* Footer: deadline + actions */}
      <div className="flex items-center justify-between pt-2 border-t border-divider">
        <div className="text-xs">
          {status === 'published' ? (
            <span className="text-text-faint">Updated {lastUpdated}</span>
          ) : (
            <span className={daysLeft < 30 ? 'text-warning font-medium' : 'text-text-muted'}>
              Due {dueDate} · {daysLeft} days
            </span>
          )}
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
          Export ↓
        </button>
      </div>
    </div>
  );
}
