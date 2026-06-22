"use client";

import React from "react";
import GenericAreaChart from "@/components/charts/GenericAreaChart";
import { MonthlyEmissionsData } from "@/types/emissions";

interface BuildingEvolutionProps {
  summary: Record<string, MonthlyEmissionsData> | undefined;
}

const BuildingEvolution: React.FC<BuildingEvolutionProps> = ({ summary }) => {
  const chartData =
    summary && Object.keys(summary).length > 0
      ? Object.entries(summary).map(([monthKey, monthValue]) => ({
          month: monthKey,
          emissions: monthValue.emissions,
        }))
      : [];

  const seriesConfig = [
    {
      dataKey: "emissions",
      name: "Emisiones",
      stroke: "#89CCC5",
      gradientId: "colorBuilding",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-10">
      <h2 className="text-xl font-semibold mb-10 text-gray-700">
        Evolución de las emisiones (Edificios)
      </h2>
      {chartData.length > 0 ? (
        <GenericAreaChart data={chartData} series={seriesConfig} />
      ) : (
        <div>No hay datos de evolución para mostrar.</div>
      )}
    </div>
  );
};

export default BuildingEvolution;
