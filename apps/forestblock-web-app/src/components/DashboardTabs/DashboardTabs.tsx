"use client";

import React from "react";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import ScopeChart from "@/components/charts/ScopeChart";
import MonthlyChart from "@/components/charts/MonthlyChart";
import { DashboardTabsProps } from "./types";
import Tabs from "./Tabs";

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  currentScopeChartData,
  hasScopeChartData,
  monthlyDataAlcance,
  COLORS,
  hasMonthlyData,
  monthlyChartComponent,
}) => {
  return (
    <>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <DashboardCard title={`Emisiones por ${activeTab}`}>
          {activeTab === "alcance" ? (
            hasScopeChartData ? (
              <ScopeChart data={currentScopeChartData} colors={COLORS} />
            ) : (
              <p>No scope chart data available for the selected period.</p>
            )
          ) : (
            <ScopeChart data={currentScopeChartData} colors={COLORS} />
          )}
        </DashboardCard>

        <DashboardCard
          title={`Evolución mensual por ${activeTab}`}
          extraClassNames="text-gray-700"
        >
          {activeTab === "alcance" ? (
            hasMonthlyData ? (
              <MonthlyChart data={monthlyDataAlcance} colors={COLORS} />
            ) : (
              <p>
                No monthly evolution data available for the selected period.
              </p>
            )
          ) : (
            monthlyChartComponent
          )}
        </DashboardCard>
      </div>
    </>
  );
};

export default DashboardTabs;
