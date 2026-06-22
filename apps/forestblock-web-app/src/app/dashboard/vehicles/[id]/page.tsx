"use client";

import React, { useState, useEffect } from "react";
import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";
import TopBar from "@/components/TopBar/TopBar";
import UserAlerts from "@/components/UserAlerts/UserAlerts";
import VehiclesSummary from "@/components/VehiclesSummary/VehiclesSummary";
import { useVehicles } from "@/hooks/useVehicles";
import { useAuth } from "@/context/AuthContext";
import VehicleEvolution from "@/components/VehicleEvolution/VehicleEvolution";
import VehicleCategoryChart from "@/components/VehicleCategoryChart/VehicleCategoryChart";
import VehicleFuelChart from "@/components/VehicleFuelChart/VehicleFuelChart";
import VehicleBrandChart from "@/components/VehicleBrandChart/VehicleBrandChart";
import DashboardHeader from "@/components/DashboardHeader/DashboardHeader";
import useEmployees from "@/hooks/useEmployees";
import { usePersistedYear } from "@/hooks/usePersistedYear";

const VehiclesPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedYear, handleYearChange, availableYears, startDate, endDate } =
    usePersistedYear(10);

  const { employees } = useEmployees(user?.manglaiCompanyId);

  const { vehicles, vehiclesSummary, loading, error } = useVehicles(
    user?.manglaiCompanyId,
    startDate,
    endDate
  );

  const categoryIdToNameMap = new Map<string, string>();

  vehicles.forEach((v) => {
    const id = v.vehicleCategory?.id;
    const name = v.vehicleCategory?.name;
    if (id && name && !categoryIdToNameMap.has(id)) {
      categoryIdToNameMap.set(id, name);
    }
  });

  const fuelIdToNameMapObj: Record<string, string> = {};

  vehicles.forEach((v) => {
    const id = v.fuelType?.id;
    const name = v.fuelType?.name;
    if (id && name && !fuelIdToNameMapObj[id]) {
      fuelIdToNameMapObj[id] = name;
    }
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  useEffect(() => {
    if (
      vehiclesSummary &&
      Object.keys(vehiclesSummary.vehicleCategory).length > 1 &&
      !selectedCategoryId
    ) {
      const keys = Object.keys(vehiclesSummary.vehicleCategory);
      setSelectedCategoryId(keys[0]);
    }
  }, [vehiclesSummary, selectedCategoryId]);

  if (loading) return <LoaderScreenDynamic />;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="p-3 flex flex-col min-h-screen">
      <TopBar />
      <UserAlerts />
      {user?.manglaiCompanyId && (
        <div className="flex-1 p-5 md:p-10 bg-backgroundGray rounded-xl mt-5">
          <DashboardHeader
            title="Vehículos"
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />

          <VehiclesSummary
            totalVehicleEmissions={vehiclesSummary?.totalEmissions}
            numberOfVehicles={vehicles.length}
            numberOfEmployees={employees.length}
          />

          {vehiclesSummary &&
            Object.keys(vehiclesSummary.vehicleCategory).length > 1 && (
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="mb-10 p-2 border border-gray-300 rounded"
              >
                {Object.entries(vehiclesSummary.vehicleCategory).map(
                  ([categoryId, categoryData]) => (
                    <option key={categoryId} value={categoryId}>
                      {categoryData.count} registros – Emisiones:{" "}
                      {categoryData.totalEmissions.toFixed(2)} t CO₂e
                    </option>
                  )
                )}
              </select>
            )}

          <VehicleEvolution
            summary={vehiclesSummary}
            selectedCategoryId={selectedCategoryId}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            <VehicleCategoryChart
              summary={vehiclesSummary}
              categoryNames={categoryIdToNameMap}
            />
            <VehicleFuelChart
              summary={vehiclesSummary}
              fuelIdToNameMap={fuelIdToNameMapObj}
            />
            <VehicleBrandChart summary={vehiclesSummary} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
