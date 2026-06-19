'use client';

import React from 'react';
import { esgOverviewData } from '@/data/esg-mock';
import { KPIWidget } from '@/components/esg/KPIWidget';
import { PillarCard } from '@/components/esg/PillarCard';
import { TrendChart } from '@/components/esg/TrendChart';
import { PieChart } from '@/components/esg/PieChart';
import { IndicatorsTable } from '@/components/esg/IndicatorsTable';

export default function OverviewPage() {
  const { kpis, pillars, trendChartData, emissionsData, frameworks, deadlines, indicators } =
    esgOverviewData;

  // Prepare pie chart data
  const pieData = emissionsData.map((e) => ({
    name: e.scope,
    value: e.emissions,
    color: e.color === 'primary' ? 'rgb(30, 107, 76)' : e.color === 'secondary' ? 'rgb(14, 78, 90)' : 'rgb(184, 137, 45)',
  }));

  // Prepare trend chart lines
  const trendLines = [
    { key: 'environmental', name: 'Environmental', color: 'rgb(30, 107, 76)' },
    { key: 'social', name: 'Social', color: 'rgb(14, 78, 90)' },
    { key: 'governance', name: 'Governance', color: 'rgb(184, 137, 45)' },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-text">ESG Overview</h1>
        <p className="text-text-muted mt-2">
          Track your Environmental, Social & Governance performance across all pillars.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-4">
        <KPIWidget
          label={kpis.environmental.label}
          value={kpis.environmental.value}
          unit={kpis.environmental.unit}
          trend={kpis.environmental.trend}
          trendDirection={'down'}
          status={'on_track'}
          target={kpis.environmental.target}
        />
        <KPIWidget
          label={kpis.social.label}
          value={kpis.social.value}
          unit={kpis.social.unit}
          trend={kpis.social.trend}
          trendDirection={'up'}
          status={'on_track'}
          target={kpis.social.target}
        />
        <KPIWidget
          label={kpis.governance.label}
          value={kpis.governance.value}
          unit={kpis.governance.unit}
          trend={kpis.governance.trend}
          trendDirection={'up'}
          status={'on_track'}
          target={kpis.governance.target}
        />
      </div>

      {/* Pillar Cards */}
      <div className="grid grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <PillarCard
            key={pillar.type}
            type={pillar.type as 'environmental' | 'social' | 'governance'}
            totalIndicators={pillar.totalIndicators}
            completeness={pillar.completeness}
            status={pillar.status}
            highlights={pillar.highlights}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <TrendChart
          data={trendChartData}
          lines={trendLines}
          title="Pillar Trends (Last 6 months)"
        />
        <PieChart data={pieData} title="Emissions by Scope (2024)" />
      </div>

      {/* Framework Coverage */}
      <div className="bg-surface rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold text-text mb-4">Framework Coverage</h2>
        <div className="space-y-3">
          {frameworks.map((fw, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface-alt rounded">
              <div className="flex-1">
                <p className="font-medium text-sm text-text">{fw.name}</p>
                <p className="text-xs text-text-muted">{fw.disclosure}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <div className="h-2 bg-divider rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${fw.coverage}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted text-right mt-1">{fw.coverage}%</p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    fw.status === 'on_track'
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}
                >
                  {fw.status === 'on_track' ? 'On Track' : 'Attention'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deadlines */}
      <div className="bg-surface rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold text-text mb-4">Upcoming Deadlines</h2>
        <div className="space-y-2">
          {deadlines.map((dl, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface-alt rounded">
              <div className="flex-1">
                <p className="font-medium text-sm text-text">{dl.framework}</p>
                <p className="text-xs text-text-muted">{dl.dueDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold ${dl.daysLeft < 30 ? 'text-warning' : 'text-success'}`}>
                  {dl.daysLeft} days
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators Table */}
      <IndicatorsTable
        indicators={indicators.map((ind) => ({
          id: ind.id,
          name: ind.name,
          value: ind.value,
          unit: ind.unit,
          target: ind.target,
          status: ind.status as 'on_track' | 'attention' | 'at_risk',
          evidence: ind.evidence as 'verified' | 'partial' | 'missing',
          frameworks: ind.frameworks,
        }))}
        title="Key Indicators"
      />
    </div>
  );
}
