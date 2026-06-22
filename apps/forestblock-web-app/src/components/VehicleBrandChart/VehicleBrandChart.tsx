"use client";

import React from "react";
import GenericDonutChart from "@/components/charts/GenericDonutChart";
import { DonutDataItem } from "../charts/types";
import { VehicleBrandChartProps } from "./types";

const VehicleBrandChart: React.FC<VehicleBrandChartProps> = ({ summary }) => {
  const chartData: DonutDataItem[] = [];

  if (summary?.brand) {
    Object.entries(summary.brand).forEach(([brandId, brandValue], index) => {
      const name = brandId === "no-brand" ? "Sin marca" : brandId;
      const value = brandValue.totalEmissions;
      const color = pickColor(index);
      chartData.push({ name, value, color });
    });
  }

  function pickColor(index: number): string {
    const COLORS = ["#89CCC5", "#96CF9C", "#E2B370", "#ddd", "#ffb1b1"];
    return COLORS[index % COLORS.length];
  }

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4">Emisiones por marca</h3>
      {chartData.length > 0 ? (
        <GenericDonutChart data={chartData} />
      ) : (
        <p>No hay datos de marca</p>
      )}
    </div>
  );
};

export default VehicleBrandChart;
