import React from 'react';
import { governanceDetailData } from '@forestblock/data';
import {
  KPIWidget,
  TrendChart,
  BarChart,
  IndicatorsTable,
} from '@forestblock/ui/esg';

export const metadata = {
  title: 'Governance | carbonTrack',
};

export default function GovernancePage() {
  const { kpis, trends, indicatorsByCategory } = governanceDetailData;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-text">Governance</h1>

      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Board</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget {...kpis.independence} />
          <KPIWidget {...kpis.diversity} />
          <KPIWidget {...kpis.risk} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text mb-4">
          Ethics & Compliance
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget {...kpis.compliance} />
          <KPIWidget {...kpis.training} />
          <KPIWidget {...kpis.whistleblower} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TrendChart
          data={trends.board}
          lines={trends.boardCompositionLines}
          title="Board Composition Trend"
        />
        <TrendChart
          data={trends.ethics}
          lines={trends.ethicsLines}
          title="Ethics & Compliance Trend (Last 6 months)"
        />
      </div>

      {Object.entries(indicatorsByCategory).map(([category, indicators]) => (
        <IndicatorsTable
          key={category}
          title={category}
          indicators={indicators}
        />
      ))}
    </div>
  );
}
