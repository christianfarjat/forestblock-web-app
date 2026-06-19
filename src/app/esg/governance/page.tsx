'use client';

import React from 'react';
import { governanceDetailData } from '@/data/esg-mock';
import { KPIWidget } from '@/components/esg/KPIWidget';
import { TrendChart } from '@/components/esg/TrendChart';
import { IndicatorsTable } from '@/components/esg/IndicatorsTable';

export default function GovernancePage() {
  const { kpis, boardTrend, complianceTrend, indicators } = governanceDetailData;

  // Board composition trend lines
  const boardLines = [
    { key: 'independent', name: 'Board Independence (%)', color: 'rgb(30, 107, 76)' },
    { key: 'diversity', name: 'Gender Diversity (%)', color: 'rgb(14, 78, 90)' },
  ];

  // Compliance trend lines
  const complianceLines = [
    { key: 'completion', name: 'Ethics Training (%)', color: 'rgb(30, 107, 76)' },
    { key: 'incidents', name: 'Whistleblower Cases', color: 'rgb(178, 64, 64)' },
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
        <h1 className="text-3xl font-bold text-text">Governance Indicators</h1>
        <p className="text-text-muted mt-2">
          Track board composition, ethics, compliance, risk management and data security metrics.
        </p>
      </div>

      {/* Board KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Board &amp; Leadership</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget
            label={kpis.independence.label}
            value={kpis.independence.value}
            unit={kpis.independence.unit}
            trend={kpis.independence.trend}
            trendDirection="up"
            status="on_track"
            methodology={kpis.independence.methodology}
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
            label={kpis.risk.label}
            value={kpis.risk.value}
            unit={kpis.risk.unit}
            trend={kpis.risk.trend}
            trendDirection="up"
            status="on_track"
            methodology={kpis.risk.methodology}
          />
        </div>
      </div>

      {/* Ethics & Compliance KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Ethics &amp; Compliance</h2>
        <div className="grid grid-cols-3 gap-4">
          <KPIWidget
            label={kpis.compliance.label}
            value={kpis.compliance.value}
            unit={kpis.compliance.unit}
            trend={kpis.compliance.trend}
            trendDirection="up"
            status="on_track"
            methodology={kpis.compliance.methodology}
          />
          <KPIWidget
            label={kpis.ethics.label}
            value={kpis.ethics.value}
            unit={kpis.ethics.unit}
            trend={kpis.ethics.trend}
            trendDirection="up"
            status="on_track"
            methodology={kpis.ethics.methodology}
          />
          <KPIWidget
            label={kpis.incidents.label}
            value={kpis.incidents.value}
            unit={kpis.incidents.unit}
            trend={kpis.incidents.trend}
            trendDirection="down"
            status="on_track"
            methodology={kpis.incidents.methodology}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <TrendChart
          data={boardTrend}
          lines={boardLines}
          title="Board Composition (Last 6 months)"
        />
        <TrendChart
          data={complianceTrend}
          lines={complianceLines}
          title="Ethics & Compliance (Last 6 months)"
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
