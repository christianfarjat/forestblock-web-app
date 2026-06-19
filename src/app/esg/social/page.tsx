'use client';

import React from 'react';
import { socialDetailData } from '@/data/esg-mock';
import { KPIWidget } from '@/components/esg/KPIWidget';
import { TrendChart } from '@/components/esg/TrendChart';
import { BarChart } from '@/components/esg/BarChart';
import { IndicatorsTable } from '@/components/esg/IndicatorsTable';

export default function SocialPage() {
  const { kpis, workforceTrend, safetyTrend, indicators } = socialDetailData;

  // Workforce composition bar chart
  const workforceBars = [
    { key: 'women', name: 'Women', color: 'rgb(14, 78, 90)' },
    { key: 'men', name: 'Men', color: 'rgb(184, 137, 45)' },
  ];

  // Safety trend lines
  const safetyLines = [
    { key: 'trir', name: 'Total Recordable Rate', color: 'rgb(178, 64, 64)' },
    { key: 'ltir', name: 'Lost Time Injury Rate', color: 'rgb(184, 137, 45)' },
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
        <h1 className="text-3xl font-bold text-text">Social Indicators</h1>
        <p className="text-text-muted mt-2">
          Track workforce composition, diversity, health &amp; safety, training and community engagement metrics.
        </p>
      </div>

      {/* Workforce & Diversity KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Workforce &amp; Diversity</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget
            label={kpis.headcount.label}
            value={kpis.headcount.value}
            unit={kpis.headcount.unit}
            trend={kpis.headcount.trend}
            trendDirection="up"
            status="on_track"
            methodology={kpis.headcount.methodology}
          />
          <KPIWidget
            label={kpis.diversity.label}
            value={kpis.diversity.value}
            unit={kpis.diversity.unit}
            trend={kpis.diversity.trend}
            trendDirection="up"
            status="attention"
            methodology={kpis.diversity.methodology}
          />
          <KPIWidget
            label={kpis.turnover.label}
            value={kpis.turnover.value}
            unit={kpis.turnover.unit}
            trend={kpis.turnover.trend}
            trendDirection="down"
            status="on_track"
            methodology={kpis.turnover.methodology}
          />
        </div>
      </div>

      {/* Health, Safety & Community KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Health, Safety &amp; Community</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget
            label={kpis.safety.label}
            value={kpis.safety.value}
            unit={kpis.safety.unit}
            trend={kpis.safety.trend}
            trendDirection="down"
            status="on_track"
            methodology={kpis.safety.methodology}
          />
          <KPIWidget
            label={kpis.training.label}
            value={kpis.training.value}
            unit={kpis.training.unit}
            trend={kpis.training.trend}
            trendDirection="up"
            status="on_track"
            methodology={kpis.training.methodology}
          />
          <KPIWidget
            label={kpis.community.label}
            value={kpis.community.value}
            unit={kpis.community.unit}
            trend={kpis.community.trend}
            trendDirection="up"
            status="on_track"
            methodology={kpis.community.methodology}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <BarChart
          data={workforceTrend}
          bars={workforceBars}
          title="Workforce Composition by Gender (%)"
        />
        <TrendChart
          data={safetyTrend}
          lines={safetyLines}
          title="Safety Performance (Last 6 months)"
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
