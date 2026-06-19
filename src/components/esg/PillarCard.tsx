'use client';

import React from 'react';

interface Highlight {
  label: string;
  value: string;
  trend?: number;
}

interface PillarCardProps {
  type: 'environmental' | 'social' | 'governance';
  totalIndicators: number;
  completeness: number;
  status: 'on_track' | 'attention' | 'at_risk';
  highlights: Highlight[];
  className?: string;
}

const pillarConfig = {
  environmental: { label: 'Environmental', color: 'bg-primary', icon: '🌱' },
  social: { label: 'Social', color: 'bg-secondary', icon: '👥' },
  governance: { label: 'Governance', color: 'bg-accent', icon: '⚖️' },
};

const statusConfig = {
  on_track: { bg: 'bg-success/10', text: 'text-success', label: 'On Track' },
  attention: { bg: 'bg-warning/10', text: 'text-warning', label: 'Attention' },
  at_risk: { bg: 'bg-danger/10', text: 'text-danger', label: 'At Risk' },
};

export function PillarCard({
  type,
  totalIndicators,
  completeness,
  status,
  highlights,
  className = '',
}: PillarCardProps) {
  const config = pillarConfig[type];
  const statusCfg = statusConfig[status];

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-sm p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`${config.color} rounded-lg p-2 text-white`}>{config.icon}</div>
          <div>
            <h3 className="font-semibold text-text">{config.label}</h3>
            <p className="text-xs text-text-muted">{totalIndicators} indicators</p>
          </div>
        </div>
        <div className={`${statusCfg.bg} ${statusCfg.text} px-2.5 py-1 rounded-full text-xs font-medium`}>
          {statusCfg.label}
        </div>
      </div>

      {/* Completeness bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-text-muted">Data Completeness</span>
          <span className="text-xs font-bold text-text">{completeness}%</span>
        </div>
        <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
          <div
            className={`h-full ${config.color}`}
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-2 pt-2 border-t border-divider">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{h.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">{h.value}</span>
              {h.trend !== undefined && (
                <span className={`text-xs ${h.trend < 0 ? 'text-primary' : 'text-success'}`}>
                  {h.trend < 0 ? '↓' : '↑'} {Math.abs(h.trend)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
