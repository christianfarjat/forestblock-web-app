import React from 'react';
import { reportsData } from '@forestblock/data';
import { ReportStatusCard } from '@forestblock/ui/esg';

export const metadata = {
  title: 'Reports | carbonTrack',
};

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text">Reports & Disclosures</h1>

      {/* Report status cards */}
      <div className="grid grid-cols-2 gap-4">
        {reportsData.reports.map((report) => (
          <ReportStatusCard key={report.id} {...report} />
        ))}
      </div>

      {/* Change log */}
      <div className="bg-surface rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-text p-6 border-b border-divider">
          Recent Changes
        </h2>
        <div className="divide-y divide-divider">
          {reportsData.changeLog.map((entry, idx) => (
            <div
              key={idx}
              className="p-4 flex justify-between items-center hover:bg-surface-alt/50 transition-colors"
            >
              <div>
                <p className="font-medium text-text">{entry.action}</p>
                <p className="text-sm text-text-muted">{entry.reportName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-text">{entry.user}</p>
                <p className="text-xs text-text-faint">{entry.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
