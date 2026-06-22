'use client';

import React, { useState } from 'react';
import { frameworksData } from '@/data/esg-mock';
import { DisclosuresTable } from '@/components/esg/DisclosuresTable';

export default function FrameworksPage() {
  const { frameworks, disclosures } = frameworksData;
  const [selected, setSelected] = useState(frameworks[0].id);

  const selectedFramework = frameworks.find((f) => f.id === selected) ?? frameworks[0];
  const selectedDisclosures = disclosures[selected] ?? [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Frameworks</h1>
        <p className="text-text-muted mt-2">{frameworksData.description}</p>
      </div>

      {/* Framework summary cards (clickable selectors) */}
      <div className="grid grid-cols-5 gap-4">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setSelected(fw.id)}
            className={`bg-surface rounded-lg p-4 border text-left transition-colors ${
              selected === fw.id
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text">{fw.name}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  fw.status === 'on_track' ? 'bg-success' : 'bg-warning'
                }`}
              />
            </div>
            <p className="text-2xl font-bold text-text mt-2 tabular-nums">{fw.coverage}%</p>
            <p className="text-xs text-text-faint mt-1">
              {fw.mapped}/{fw.total} mapped
            </p>
            <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary" style={{ width: `${fw.coverage}%` }} />
            </div>
          </button>
        ))}
      </div>

      {/* Selected framework detail */}
      <div className="bg-surface-alt rounded-lg p-5 border border-border">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-text">
              {selectedFramework.name} — {selectedFramework.fullName}
            </h2>
            <p className="text-xs text-text-muted font-mono mt-1">{selectedFramework.version}</p>
          </div>
          <div className="text-sm text-text-muted">
            Coverage{' '}
            <span className="font-bold text-text">{selectedFramework.coverage}%</span> ·{' '}
            {selectedFramework.mapped} of {selectedFramework.total} disclosures mapped
          </div>
        </div>
      </div>

      {/* Disclosures table */}
      <DisclosuresTable
        disclosures={selectedDisclosures}
        title={`${selectedFramework.name} Disclosures (${selectedDisclosures.length})`}
      />
    </div>
  );
}
