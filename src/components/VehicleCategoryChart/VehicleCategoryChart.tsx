/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import GenericDonutChart from "@/components/charts/GenericDonutChart";
import { DonutDataItem } from "../charts/types";
import { VehicleCategoryChartProps } from "./types";

const VehicleCategoryChart: React.FC<VehicleCategoryChartProps> = ({
  summary,
  categoryNames,
}) => {
  const chartData: DonutDataItem[] = [];

  if (summary?.vehicleCategory) {
    Object.entries(summary.vehicleCategory).forEach(
      ([catId, catValue], index) => {
        const name = categoryNames.get(catId) || catId;
        const value = catValue.totalEmissions;
        const color = pickColor(index);
        chartData.push({ name, value, color });
      }
    );
  }

  function pickColor(index: number): string {
    const COLORS = ["#89CCC5", "#96CF9C", "#E2B370", "#ddd", "#ffb1b1"];
    return COLORS[index % COLORS.length];
  }

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4">Emisiones por categoría</h3>
      {chartData.length > 0 ? (
        <GenericDonutChart data={chartData} />
      ) : (
        <p>No hay datos de categoría</p>
      )}
    </div>
  );
};

export default VehicleCategoryChart;
