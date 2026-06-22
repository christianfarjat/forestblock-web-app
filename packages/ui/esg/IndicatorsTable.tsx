'use client';

import React from 'react';

interface Indicator {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  target?: number | string;
  status: 'on_track' | 'attention' | 'at_risk';
  evidence: 'verified' | 'partial' | 'missing';
  completeness?: number;
  frameworks?: string[];
  lastUpdated?: string;
}

interface IndicatorsTableProps {
  indicators: Indicator[];
  title?: string;
  className?: string;
}

const statusConfig = {
  on_track: { bg: 'bg-success/10', text: 'text-success', label: 'On Track' },
  attention: { bg: 'bg-warning/10', text: 'text-warning', label: 'Attention' },
  at_risk: { bg: 'bg-danger/10', text: 'text-danger', label: 'At Risk' },
};

const evidenceConfig = {
  verified: { color: 'text-success', label: 'Verified', icon: '✓' },
  partial: { color: 'text-warning', label: 'Partial', icon: '◐' },
  missing: { color: 'text-danger', label: 'Missing', icon: '✕' },
};

export function IndicatorsTable({ indicators, title, className = '' }: IndicatorsTableProps) {
  return (
    <div className={`bg-surface rounded-lg border border-border overflow-hidden ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-divider">
          <h3 className="text-sm font-semibold text-text">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider bg-surface-alt">
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Indicator</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Value</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Target</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Evidence</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Frameworks</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((indicator) => {
              const statusCfg = statusConfig[indicator.status];
              const evidenceCfg = evidenceConfig[indicator.evidence];
              return (
                <tr key={indicator.id} className="border-b border-divider hover:bg-surface-alt/50 transition-colors">
                  {/* Indicator Name */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-text">{indicator.name}</p>
                      {indicator.lastUpdated && (
                        <p className="text-xs text-text-faint">Updated {indicator.lastUpdated}</p>
                      )}
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3">
                    <span className="font-semibold text-text">
                      {typeof indicator.value === 'number'
                        ? indicator.value.toLocaleString()
                        : indicator.value}
                    </span>
                    {indicator.unit && (
                      <span className="text-xs text-text-muted ml-1">{indicator.unit}</span>
                    )}
                  </td>

                  {/* Target */}
                  <td className="px-4 py-3 text-text-muted">
                    {indicator.target ? (
                      <>
                        {typeof indicator.target === 'number'
                          ? indicator.target.toLocaleString()
                          : indicator.target}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className={`${statusCfg.bg} ${statusCfg.text} px-2 py-1 rounded text-xs font-medium w-fit`}>
                      {statusCfg.label}
                    </div>
                  </td>

                  {/* Evidence */}
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 ${evidenceCfg.color}`}>
                      <span>{evidenceCfg.icon}</span>
                      <span className="text-xs font-medium">{evidenceCfg.label}</span>
                    </div>
                  </td>

                  {/* Frameworks */}
                  <td className="px-4 py-3">
                    {indicator.frameworks ? (
                      <div className="flex flex-wrap gap-1">
                        {indicator.frameworks.map((fw) => (
                          <span
                            key={fw}
                            className="px-1.5 py-0.5 bg-primary-soft text-primary rounded text-xs font-medium"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
