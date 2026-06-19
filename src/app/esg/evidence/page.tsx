'use client';

import React, { useState } from 'react';
import { evidenceVaultData } from '@/data/esg-mock';
import { EvidenceTable } from '@/components/esg/EvidenceTable';

type ValidationFilter = 'all' | 'verified' | 'partial' | 'missing';

export default function EvidencePage() {
  const { stats, documents } = evidenceVaultData;
  const [filter, setFilter] = useState<ValidationFilter>('all');

  const filteredDocuments =
    filter === 'all' ? documents : documents.filter((d) => d.validation === filter);

  const statCards = [
    { key: 'all' as const, label: 'Total Documents', value: stats.total, color: 'text-text' },
    { key: 'verified' as const, label: 'Verified', value: stats.verified, color: 'text-success' },
    { key: 'partial' as const, label: 'Partial', value: stats.partial, color: 'text-warning' },
    { key: 'missing' as const, label: 'Missing', value: stats.missing, color: 'text-danger' },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Evidence Vault</h1>
        <p className="text-text-muted mt-2">{evidenceVaultData.description}</p>
      </div>

      {/* Stat cards (also act as filters) */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => (
          <button
            key={card.key}
            onClick={() => setFilter(card.key)}
            className={`bg-surface rounded-lg p-4 border text-left transition-colors ${
              filter === card.key
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
              {card.label}
            </p>
            <p className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</p>
          </button>
        ))}
      </div>

      {/* Documents table */}
      <EvidenceTable
        documents={filteredDocuments.map((d) => ({
          ...d,
          pillar: d.pillar as 'environmental' | 'social' | 'governance',
          validation: d.validation as 'verified' | 'partial' | 'missing',
        }))}
        title={`Documents${filter !== 'all' ? ` — ${filter}` : ''} (${filteredDocuments.length})`}
      />
    </div>
  );
}
