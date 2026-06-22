'use client';

import React, { useState } from 'react';
import { evidenceVaultData } from '@forestblock/data';
import { EvidenceTable } from '@forestblock/ui/esg';

export default function EvidencePage() {
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'verified' | 'partial' | 'missing'
  >('all');

  const stats = {
    total: evidenceVaultData.length,
    verified: evidenceVaultData.filter((d) => d.validation === 'verified')
      .length,
    partial: evidenceVaultData.filter((d) => d.validation === 'partial').length,
    missing: evidenceVaultData.filter((d) => d.validation === 'missing').length,
  };

  const filtered =
    selectedFilter === 'all'
      ? evidenceVaultData
      : evidenceVaultData.filter((d) => d.validation === selectedFilter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text">Evidence Vault</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: stats.total, filter: 'all' },
          { label: 'Verified', value: stats.verified, filter: 'verified' },
          { label: 'Partial', value: stats.partial, filter: 'partial' },
          { label: 'Missing', value: stats.missing, filter: 'missing' },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() =>
              setSelectedFilter(
                stat.filter as 'all' | 'verified' | 'partial' | 'missing'
              )
            }
            className={`p-4 rounded-lg border text-center transition ${
              selectedFilter === stat.filter
                ? 'border-primary bg-primary-soft'
                : 'border-divider hover:border-primary'
            }`}
          >
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      <EvidenceTable documents={filtered} />
    </div>
  );
}
