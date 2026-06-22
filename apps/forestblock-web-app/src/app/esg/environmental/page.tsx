'use client';

import React from 'react';
import { environmentalDetailData } from '@/data/esg-mock';
import { KPIWidget } from '@/components/esg/KPIWidget';
import { TrendChart } from '@/components/esg/TrendChart';
import { BarChart } from '@/components/esg/BarChart';
import { IndicatorsTable } from '@/components/esg/IndicatorsTable';

export default function EnvironmentalPage() {
  const { kpis, emissionsTrend, energyTrend, indicators } = environmentalDetailData;

  // Prepare emissions trend chart
  const emissionsTrendLines = [
    { key: 'scope1', name: 'Scope 1 (Direct)', color: 'rgb(30, 107, 76)' },
    { key: 'scope2', name: 'Scope 2 (Electricity)', color: 'rgb(14, 78, 90)' },
    { key: 'scope3', name: 'Scope 3 (Indirect)', color: 'rgb(184, 137, 45)' },
  ];

  // Prepare energy bar chart data
  const energyBarData = energyTrend.map((e) => ({
    month: e.month,
    renewable: e.renewable,
    nonRenewable: e.nonRenewable,
  }));

  const energyBars = [
    { key: 'renewable', name: 'Renewable', color: 'rgb(30, 107, 76)' },
    { key: 'nonRenewable', name: 'Non-Renewable', color: 'rgb(178, 64, 64)' },
  ];

  // Group indicators by category
  const indicatorsByCategory = indicators.reduce(
    (acc, ind) => {
      if (!acc[ind.category]) acc[ind.category] = [];
      acc[ind.category].push(ind);
      return acc;
    },
    {} as Record<string, typeof indicators>
  );

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Environmental Indicators</h1>
        <p className="text-text-muted mt-2">
          Track emissions by scope, energy consumption, water use, waste management, and biodiversity metrics.
        </p>
      </div>

      {/* Emissions KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Emissions (GHG Protocol)</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget
            label={kpis.scope1.label}
            value={kpis.scope1.value}
            unit={kpis.scope1.unit}
            trend={kpis.scope1.trend}
            trendDirection="down"
            status="on_track"
            methodology={kpis.scope1.methodology}
          />
          <KPIWidget
            label={kpis.scope2.label}
            value={kpis.scope2.value}
            unit={kpis.scope2.unit}
            trend={kpis.scope2.trend}
            trendDirection="down"
            status="on_track"
            methodology={kpis.scope2.methodology}
          />
          <KPIWidget
            label={kpis.scope3.label}
            value={kpis.scope3.value}
            unit={kpis.scope3.unit}
            trend={kpis.scope3.trend}
            trendDirection="down"
            status="on_track"
            methodology={kpis.scope3.methodology}
          />
        </div>
      </div>

      {/* Energy & Other KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Other Environmental Indicators</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget
            label={kpis.renewable.label}
            value={kpis.renewable.value}
            unit={kpis.renewable.unit}
            trend={kpis.renewable.trend}
            trendDirection="up"
            status="attention"
            methodology={kpis.renewable.methodology}
          />
          <KPIWidget
            label={kpis.water.label}
            value={kpis.water.value}
            unit={kpis.water.unit}
            trend={kpis.water.trend}
            trendDirection="up"
            status="at_risk"
            methodology={kpis.water.methodology}
          />
          <KPIWidget
            label={kpis.waste.label}
            value={kpis.waste.value}
            unit={kpis.waste.unit}
            trend={kpis.waste.trend}
            trendDirection="down"
            status="on_track"
            methodology={kpis.waste.methodology}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <TrendChart
          data={emissionsTrend}
          lines={emissionsTrendLines}
          title="Emissions Trend by Scope (Last 6 months)"
        />
        <BarChart
          data={energyBarData}
          bars={energyBars}
          title="Energy Mix (Last 6 months)"
        />
      </div>

      {/* Indicators by category */}
      {Object.entries(indicatorsByCategory).map(([category, categoryIndicators]) => (
        <div key={category}>
          <h2 className="text-lg font-semibold text-text mb-4">{category}</h2>
          <IndicatorsTable
            indicators={categoryIndicators.map((ind) => ({
              id: ind.id,
              name: ind.name,
              value: ind.value,
              unit: ind.unit,
              target: ind.target,
              status: ind.status as 'on_track' | 'attention' | 'at_risk',
              evidence: ind.evidence as 'verified' | 'partial' | 'missing',
              completeness: ind.completeness,
              frameworks: ind.frameworks,
              lastUpdated: ind.lastUpdated,
            }))}
          />
        </div>
      ))}
    </div>
  );
}
