'use client';

import React, { useState } from 'react';
import { frameworksData } from '@forestblock/data';
import { DisclosuresTable } from '@forestblock/ui/esg';

export default function FrameworksPage() {
  const [selectedFramework, setSelectedFramework] = useState('ESRS');

  const selectedFrameworkData = frameworksData.detailed.find(
    (fw) => fw.frameworkId === selectedFramework
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text">Frameworks</h1>

      {/* Framework selector */}
      <div className="grid grid-cols-5 gap-4">
        {frameworksData.summary.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setSelectedFramework(fw.id)}
            className={`p-4 rounded-lg border text-center transition ${
              selectedFramework === fw.id
                ? 'border-primary bg-primary-soft'
                : 'border-divider hover:border-primary'
            }`}
          >
            <h3 className="font-semibold text-text">{fw.name}</h3>
            <p className="text-xs text-text-muted">{fw.coverage}% coverage</p>
            <p className="text-xs text-text-faint">
              {fw.mapped}/{fw.total}
            </p>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selectedFrameworkData && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-text mb-2">
            {selectedFrameworkData.frameworkId}
          </h2>
          <p className="text-sm text-text-muted mb-4">
            Detailed disclosure mapping
          </p>

          <DisclosuresTable
            title={`${selectedFrameworkData.frameworkId} Datapoints`}
            disclosures={selectedFrameworkData.datapoints}
          />
        </div>
      )}
    </div>
  );
}
