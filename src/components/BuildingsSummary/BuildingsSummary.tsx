"use client";

import React from "react";
import DataCard from "@/components/DataCard/DataCard";

interface BuildingsSummaryProps {
  totalBuildingEmissions: number | undefined;
  numberOfBuildings: number;
  totalEmployees?: number;
}

const BuildingsSummary: React.FC<BuildingsSummaryProps> = ({
  totalBuildingEmissions,
  numberOfBuildings,
  totalEmployees,
}) => {
  const totalEmissionsTons = totalBuildingEmissions
    ? totalBuildingEmissions.toFixed(2)
    : "0.00";

  const emissionsPerBuilding =
    numberOfBuildings && totalBuildingEmissions
      ? (totalBuildingEmissions / numberOfBuildings).toFixed(2)
      : "0.00";

  const emissionsPerEmployee =
    totalEmployees && totalBuildingEmissions
      ? (totalBuildingEmissions / totalEmployees).toFixed(2)
      : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <DataCard
        title="Emisiones totales (Edificios)"
        value={totalEmissionsTons}
        unit="t CO₂e"
        variant="primary"
      />
      <DataCard
        title="Emisiones por edificio"
        value={emissionsPerBuilding}
        unit="t CO₂e"
      />

      <DataCard
        title="Emisiones por empleado"
        value={emissionsPerEmployee}
        unit="t CO₂e"
      />
    </div>
  );
};

export default BuildingsSummary;
