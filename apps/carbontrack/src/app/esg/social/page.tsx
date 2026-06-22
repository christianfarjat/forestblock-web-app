import React from 'react';
import { socialDetailData } from '@forestblock/data';
import {
  KPIWidget,
  TrendChart,
  BarChart,
  IndicatorsTable,
} from '@forestblock/ui/esg';

export const metadata = {
  title: 'Social | carbonTrack',
};

export default function SocialPage() {
  const { kpis, trends, indicatorsByCategory } = socialDetailData;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-text">Social</h1>

      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Workforce</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget {...kpis.headcount} />
          <KPIWidget {...kpis.diversity} />
          <KPIWidget {...kpis.turnover} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text mb-4">
          Health & Safety & Community
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget {...kpis.trir} />
          <KPIWidget {...kpis.training} />
          <KPIWidget {...kpis.community} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <BarChart
          data={trends.workforce}
          bars={trends.workforceCompositionBars}
          title="Workforce Composition"
        />
        <TrendChart
          data={trends.safety}
          lines={trends.safetyLines}
          title="Safety Trend (Last 6 months)"
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
