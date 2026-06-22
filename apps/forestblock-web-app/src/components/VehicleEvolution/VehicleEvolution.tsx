"use client";

import React from "react";
import GenericAreaChart from "@/components/charts/GenericAreaChart";
import { VehicleDashboardSummary } from "@/types/vehicles";

interface VehicleEvolutionProps {
  summary: VehicleDashboardSummary | undefined;
  selectedCategoryId?: string;
}

const VehicleEvolution: React.FC<VehicleEvolutionProps> = ({ summary }) => {
  const effectiveCategoryId =
    summary && Object.keys(summary.vehicleCategory).length > 0
      ? Object.keys(summary.vehicleCategory)[0]
      : "";

  const chartData = Object.entries(summary?.monthly ?? {}).map(
    ([monthKey, monthValue]) => {
      const categoryData = monthValue.vehicleCategory[effectiveCategoryId];
      const emissions = categoryData?.totalEmissions ?? 0;
      return {
        month: monthKey,
        emissions,
      };
    }
  );

  const seriesConfig = [
    {
      dataKey: "emissions",
      name: "Emisiones",
      stroke: "#89CCC5",
      gradientId: "colorCategory",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-10">
      <h2 className="text-xl font-semibold mb-10 text-gray-700">
        Evolución de las emisiones por categoría (Vehículos)
      </h2>
      {effectiveCategoryId ? (
        <GenericAreaChart data={chartData} series={seriesConfig} />
      ) : (
        <div>No hay categorías disponibles.</div>
      )}
    </div>
  );
};

export default VehicleEvolution;
