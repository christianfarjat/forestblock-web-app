import React from 'react';
import { esgOverviewData } from '@forestblock/data';
import {
  KPIWidget,
  PillarCard,
  TrendChart,
  PieChart,
  IndicatorsTable,
} from '@forestblock/ui/esg';

export const metadata = {
  title: 'ESG Overview | carbonTrack',
};

export default function OverviewPage() {
  const {
    kpis,
    pillars,
    trends,
    emissions,
    frameworks,
    deadlines,
    indicators,
  } = esgOverviewData;

  return (
    <div className="p-6 space-y-8">
      {/* KPI Strip */}
      <div>
        <h1 className="text-2xl font-bold text-text mb-4">ESG Overview</h1>
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
              key={pillar.pillar}
              pillar={pillar.pillar}
              totalIndicators={pillar.totalIndicators}
              completeness={pillar.completeness}
              status={pillar.status as 'on_track' | 'attention' | 'at_risk'}
              highlights={pillar.highlights}
            />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <TrendChart
          data={trends.emissions}
          lines={trends.emissionLines}
          title="Emissions Trend (Last 6 months)"
        />
        <div className="bg-surface rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold text-text mb-4">
            Emissions Breakdown
          </h3>
          <PieChart
            data={emissions.data}
            cells={emissions.cells}
          />
        </div>
      </div>

      {/* Framework Coverage */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">
          Framework Coverage
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {frameworks.map((fw) => (
            <div
              key={fw.id}
              className="bg-surface rounded-lg border border-border p-4 text-center"
            >
              <h3 className="font-semibold text-text">{fw.name}</h3>
              <p className="text-sm text-text-muted">{fw.coverage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deadlines */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Upcoming Deadlines</h2>
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="divide-y divide-divider">
            {deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-text">{deadline.name}</p>
                  <p className="text-sm text-text-muted">{deadline.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text">
                    {deadline.daysLeft} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators Table */}
      <IndicatorsTable
        title="Key Indicators"
        indicators={indicators}
      />
    </div>
  );
}
