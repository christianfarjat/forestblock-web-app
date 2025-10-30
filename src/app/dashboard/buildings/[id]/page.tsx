"use client";

import TopBar from "@/components/TopBar/TopBar";
import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";
import UserAlerts from "@/components/UserAlerts/UserAlerts";
import DashboardHeader from "@/components/DashboardHeader/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { useBuildingsEmissions } from "@/hooks/useBuildingsEmissions";
import BuildingsSummary from "@/components/BuildingsSummary/BuildingsSummary";
import BuildingEvolution from "@/components/BuildingEvolution/BuildingEvolution";
import useEmployees from "@/hooks/useEmployees";
import { usePersistedYear } from "@/hooks/usePersistedYear";
import { MonthlyEmissionsData } from "@/types/emissions";

export default function BuildingsPage() {
  const { user } = useAuth();
  const { selectedYear, availableYears, handleYearChange, startDate, endDate } =
    usePersistedYear(10);

  const { employees } = useEmployees(user?.manglaiCompanyId);

  const { buildings, emissions, loading, error } = useBuildingsEmissions(
    user?.manglaiCompanyId,
    startDate,
    endDate
  );

  if (loading) return <LoaderScreenDynamic />;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  const totalBuildingEmissions = emissions?.data.reduce(
    (total, record) => total + record.emission,
    0
  );

  const monthlyAggregation = emissions?.data.reduce<
    Record<string, MonthlyEmissionsData>
  >((agg, record) => {
    const date = new Date(record.startDate);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!agg[monthYear]) {
      agg[monthYear] = {
        emissions: 0,
        numberOfEmissions: 0,
        uncertainty: { fe: 0, da: 0 },
        category: {},
        company: {},
        building: {},
        categoryByBuilding: {},
        categoryByCompany: {},
      };
    }

    agg[monthYear].emissions += record.emission;
    agg[monthYear].numberOfEmissions += 1;

    return agg;
  }, {});

  const numberOfBuildings = buildings.length;
  const totalEmployees = employees.length;

  return (
    <div className="p-3 flex flex-col min-h-screen">
      <TopBar />
      <UserAlerts />
      {user?.manglaiCompanyId && (
        <div className="flex-1 p-5 md:p-10 bg-backgroundGray rounded-xl mt-5">
          <DashboardHeader
            title="Edificios"
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
          <BuildingsSummary
            totalBuildingEmissions={totalBuildingEmissions}
            numberOfBuildings={numberOfBuildings}
            totalEmployees={totalEmployees}
          />
          <BuildingEvolution summary={monthlyAggregation} />
        </div>
      )}
    </div>
  );
}
