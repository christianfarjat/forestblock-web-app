'use client';

import React from 'react';
import { reportsData } from '@/data/esg-mock';
import { ReportStatusCard } from '@/components/esg/ReportStatusCard';

export default function ReportsPage() {
  const { reports, changeLog } = reportsData;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Reports &amp; Disclosures</h1>
        <p className="text-text-muted mt-2">{reportsData.description}</p>
      </div>

      {/* Report cards */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Disclosure Status</h2>
        <div className="grid grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportStatusCard
              key={report.id}
              framework={report.framework}
              name={report.name}
              period={report.period}
              coverage={report.coverage}
              status={report.status as 'in_progress' | 'review' | 'published'}
              dueDate={report.dueDate}
              daysLeft={report.daysLeft}
              pillars={report.pillars}
              lastUpdated={report.lastUpdated}
            />
          ))}
        </div>
      </div>

      {/* Change log */}
      <div className="bg-surface rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold text-text mb-4">Recent Change Log</h2>
        <div className="space-y-3">
          {changeLog.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between p-3 bg-surface-alt rounded"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{entry.action}</p>
                <p className="text-xs text-text-muted mt-0.5">{entry.report}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs font-medium text-text">{entry.user}</p>
                <p className="text-xs text-text-faint font-mono">{entry.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
