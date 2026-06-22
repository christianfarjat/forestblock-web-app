'use client';

import React from 'react';

interface Disclosure {
  id: string;
  topic: string;
  datapoint: string;
  pillar: string;
  indicator: string;
  coverage: string;
  completeness: number;
}

interface DisclosuresTableProps {
  disclosures: Disclosure[];
  title?: string;
  className?: string;
}

const coverageConfig: Record<string, { color: string; label: string; icon: string }> = {
  verified: { color: 'text-success', label: 'Verified', icon: '✓' },
  partial: { color: 'text-warning', label: 'Partial', icon: '◐' },
  missing: { color: 'text-danger', label: 'Missing', icon: '✕' },
};

const pillarConfig: Record<string, { label: string; bg: string; text: string }> = {
  environmental: { label: 'E', bg: 'bg-primary-soft', text: 'text-primary' },
  social: { label: 'S', bg: 'bg-secondary-soft', text: 'text-secondary' },
  governance: { label: 'G', bg: 'bg-accent-soft', text: 'text-accent' },
};

export function DisclosuresTable({ disclosures, title, className = '' }: DisclosuresTableProps) {
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
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Datapoint</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Topic</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Linked Indicator</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Completeness</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {disclosures.map((d) => {
              const coverageCfg = coverageConfig[d.coverage] ?? coverageConfig.missing;
              const pillarCfg = pillarConfig[d.pillar];
              return (
                <tr key={d.id} className="border-b border-divider hover:bg-surface-alt/50 transition-colors">
                  {/* Datapoint id + name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {pillarCfg && (
                        <span
                          className={`${pillarCfg.bg} ${pillarCfg.text} w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0`}
                        >
                          {pillarCfg.label}
                        </span>
                      )}
                      <div>
                        <p className="font-mono text-xs font-semibold text-primary">{d.id}</p>
                        <p className="text-text">{d.datapoint}</p>
                      </div>
                    </div>
                  </td>

                  {/* Topic */}
                  <td className="px-4 py-3 text-text-muted">{d.topic}</td>

                  {/* Linked indicator */}
                  <td className="px-4 py-3 text-text-muted">{d.indicator}</td>

                  {/* Completeness bar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-divider rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${d.completeness}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted tabular-nums">{d.completeness}%</span>
                    </div>
                  </td>

                  {/* Coverage */}
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 ${coverageCfg.color}`}>
                      <span>{coverageCfg.icon}</span>
                      <span className="text-xs font-medium">{coverageCfg.label}</span>
                    </div>
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
