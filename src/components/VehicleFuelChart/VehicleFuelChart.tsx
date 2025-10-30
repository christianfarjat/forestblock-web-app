"use client";

import React from "react";
import GenericDonutChart from "@/components/charts/GenericDonutChart";
import { DonutDataItem } from "../charts/types";
import { VehicleFuelChartProps } from "./types";

const VehicleFuelChart: React.FC<VehicleFuelChartProps> = ({
  summary,
  fuelIdToNameMap,
}) => {
  const chartData: DonutDataItem[] = [];

  if (summary?.fuelType) {
    Object.entries(summary.fuelType).forEach(([fuelId, fuelData], index) => {
      const name = fuelIdToNameMap[fuelId] || fuelId;
      const value = fuelData.totalEmissions;
      const color = pickColor(index);
      chartData.push({ name, value, color });
    });
  }

  function pickColor(index: number): string {
    const COLORS = ["#E2B370", "#96CF9C", "#8DB7E5", "#ddd", "#ffb1b1"];
    return COLORS[index % COLORS.length];
  }

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4">Emisiones por combustible</h3>
      {chartData.length > 0 ? (
        <GenericDonutChart data={chartData} />
      ) : (
        <p>No hay datos de combustible</p>
      )}
    </div>
  );
};

export default VehicleFuelChart;
