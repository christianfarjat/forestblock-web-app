'use client';

import React from 'react';

interface EvidenceDocument {
  id: string;
  name: string;
  indicator: string;
  pillar: 'environmental' | 'social' | 'governance';
  type: string;
  version: string;
  source: string;
  validation: 'verified' | 'partial' | 'missing';
  uploadedBy: string;
  lastUpdated: string;
}

interface EvidenceTableProps {
  documents: EvidenceDocument[];
  title?: string;
  className?: string;
}

const validationConfig = {
  verified: { color: 'text-success', label: 'Verified', icon: '✓' },
  partial: { color: 'text-warning', label: 'Partial', icon: '◐' },
  missing: { color: 'text-danger', label: 'Missing', icon: '✕' },
};

const pillarConfig = {
  environmental: { label: 'E', bg: 'bg-primary-soft', text: 'text-primary' },
  social: { label: 'S', bg: 'bg-secondary-soft', text: 'text-secondary' },
  governance: { label: 'G', bg: 'bg-accent-soft', text: 'text-accent' },
};

export function EvidenceTable({ documents, title, className = '' }: EvidenceTableProps) {
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
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Document</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Indicator</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Type</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Version</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Source</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Validation</th>
              <th className="px-4 py-2.5 text-left font-medium text-text-muted text-xs">Updated</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const validationCfg = validationConfig[doc.validation];
              const pillarCfg = pillarConfig[doc.pillar];
              return (
                <tr key={doc.id} className="border-b border-divider hover:bg-surface-alt/50 transition-colors">
                  {/* Document name + pillar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`${pillarCfg.bg} ${pillarCfg.text} w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0`}
                      >
                        {pillarCfg.label}
                      </span>
                      <div>
                        <p className="font-medium text-text">{doc.name}</p>
                        <p className="text-xs text-text-faint">by {doc.uploadedBy}</p>
                      </div>
                    </div>
                  </td>

                  {/* Indicator */}
                  <td className="px-4 py-3 text-text-muted">{doc.indicator}</td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 bg-surface-alt text-text-muted rounded text-xs font-mono">
                      {doc.type}
                    </span>
                  </td>

                  {/* Version */}
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{doc.version}</td>

                  {/* Source */}
                  <td className="px-4 py-3 text-text-muted">{doc.source}</td>

                  {/* Validation */}
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 ${validationCfg.color}`}>
                      <span>{validationCfg.icon}</span>
                      <span className="text-xs font-medium">{validationCfg.label}</span>
                    </div>
                  </td>

                  {/* Updated */}
                  <td className="px-4 py-3 text-xs text-text-faint">{doc.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
