import React from 'react';
import { esgOverviewData } from '@forestblock/data';
import {
  KPIWidget,
  PillarCard,
} from '@forestblock/ui/esg';

export default function TestOverview() {
  const { kpis, pillars } = esgOverviewData;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-text">ESG Overview Test</h1>

      {/* KPI Strip */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">KPIs</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget {...kpis.environmental} />
          <KPIWidget {...kpis.social} />
          <KPIWidget {...kpis.governance} />
        </div>
      </div>

      {/* Pillar Cards */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">By Pillar</h2>
        <div className="grid grid-cols-3 gap-4">
          {pillars.map((pillar) => (
            <PillarCard
              key={pillar.type}
              type={pillar.type as 'environmental' | 'social' | 'governance'}
              totalIndicators={pillar.totalIndicators}
              completeness={pillar.completeness}
              status={pillar.status as 'on_track' | 'attention' | 'at_risk'}
              highlights={pillar.highlights}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
