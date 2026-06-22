import React from 'react';
import { environmentalDetailData } from '@forestblock/data';
import {
  KPIWidget,
  TrendChart,
  BarChart,
  IndicatorsTable,
} from '@forestblock/ui/esg';

export const metadata = {
  title: 'Environmental | carbonTrack',
};

export default function EnvironmentalPage() {
  const { kpis, trends, indicatorsByCategory } = environmentalDetailData;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-text">Environmental</h1>

      {/* Scope KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Emissions</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget {...kpis.scope1} />
          <KPIWidget {...kpis.scope2} />
          <KPIWidget {...kpis.scope3} />
        </div>
      </div>

      {/* Other KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">
          Other Environmental Indicators
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget {...kpis.renewable} />
          <KPIWidget {...kpis.water} />
          <KPIWidget {...kpis.waste} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <TrendChart
          data={trends.emissions}
          lines={trends.emissionLines}
          title="Emissions Trend by Scope (Last 6 months)"
        />
        <BarChart
          data={trends.energy}
          bars={trends.energyBars}
          title="Energy Mix (Last 6 months)"
        />
      </div>

      {/* Indicators by category */}
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
