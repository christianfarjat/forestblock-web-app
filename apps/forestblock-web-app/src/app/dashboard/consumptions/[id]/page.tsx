"use client";

import React from "react";
import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";
import TopBar from "@/components/TopBar/TopBar";
import UserAlerts from "@/components/UserAlerts/UserAlerts";
import ConsumptionsSummary from "@/components/ConsumptionsSummary/ConsumptionsSummary";
import useConsumptions from "@/hooks/useConsumptions";
import { useAuth } from "@/context/AuthContext";
import ConsumptionCategoryChart from "@/components/ConsumptionCategoryChart/ConsumptionCategoryChart";
import useConsumptionsDashboard from "@/hooks/useConsumptionsDashboard";
import ConsumptionEvolution from "@/components/ConsumptionEvolution/ConsumptionEvolution";
import DashboardHeader from "@/components/DashboardHeader/DashboardHeader";
import { usePersistedYear } from "@/hooks/usePersistedYear";

export default function ConsumptionsPage() {
  const { user } = useAuth();
  const { availableYears, selectedYear, handleYearChange, startDate, endDate } =
    usePersistedYear(10);

  const { consumptions, loading, error } = useConsumptions(
    user?.manglaiCompanyId,
    startDate,
    endDate
  );

  const { buildConsumptionDashboardSummary } = useConsumptionsDashboard();

  if (loading) return <LoaderScreenDynamic />;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  const summary = buildConsumptionDashboardSummary(consumptions);

  return (
    <div className="p-3 flex flex-col min-h-screen">
      <TopBar />
      <UserAlerts />
      {user?.manglaiCompanyId && (
        <div className="flex-1 p-5 md:p-10 bg-backgroundGray rounded-xl mt-5">
          <DashboardHeader
            title="Consumos"
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
          <ConsumptionsSummary consumptions={consumptions} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <ConsumptionCategoryChart summary={summary} />
            <ConsumptionEvolution summary={summary} />
          </div>
        </div>
      )}
    </div>
  );
}
