"use client";

import React from "react";
import DataCard from "@/components/DataCard/DataCard";

interface VehiclesSummaryProps {
  totalVehicleEmissions: number | undefined;
  numberOfVehicles: number;
  numberOfEmployees: number;
}

const VehiclesSummary: React.FC<VehiclesSummaryProps> = ({
  totalVehicleEmissions,
  numberOfVehicles,
  numberOfEmployees,
}) => {
  const totalEmissionsTons = totalVehicleEmissions
    ? totalVehicleEmissions.toFixed(2)
    : "0.00";

  const emissionsPerVehicle =
    numberOfVehicles && totalVehicleEmissions
      ? (totalVehicleEmissions / numberOfVehicles).toFixed(2)
      : "0.00";

  const emissionPerEmployee =
    numberOfEmployees && totalVehicleEmissions
      ? (totalVehicleEmissions / numberOfEmployees).toFixed(2)
      : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <DataCard
        title="Emisiones totales (Vehículos de empresa)"
        value={totalEmissionsTons}
        unit="t CO₂e"
        variant="primary"
      />
      <DataCard
        title="Emisiones por vehículo"
        value={emissionsPerVehicle}
        unit="t CO₂e"
      />
      <DataCard
        title="Emisiones por empleado"
        value={emissionPerEmployee}
        unit="t CO₂e / Empleados"
      />
    </div>
  );
};

export default VehiclesSummary;
