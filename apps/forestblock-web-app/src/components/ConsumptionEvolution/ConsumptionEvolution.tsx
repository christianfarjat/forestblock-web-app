"use client";

import React from "react";
import { ConsumptionEvolutionProps } from "./types";
import GenericAreaChart from "@/components/charts/GenericAreaChart";
import useCategories, { Category } from "@/hooks/useCategories";
import { COLORS } from "@/constants";

const ConsumptionEvolution: React.FC<ConsumptionEvolutionProps> = ({
  summary,
}) => {
  const { categories, isLoading } = useCategories();
  const categoriesArray: Category[] = Array.isArray(categories)
    ? categories
    : categories && typeof categories === "object" && "data" in categories
    ? (categories as { data: Category[] }).data
    : [];

  const categoryMap = new Map<string, Category>();
  categoriesArray.forEach((cat) => {
    categoryMap.set(cat.id, cat);
  });

  const catEntries = Object.entries(summary.consumptionCategory);

  const allCatIds = catEntries.map(([catId]) => catId);

  const colorMap: Record<string, string> = {};
  catEntries.forEach(([catId], index) => {
    colorMap[catId] = COLORS[index % COLORS.length];
  });

  const months = Object.keys(summary.monthly).sort();
  const chartData = months.map((monthKey) => {
    const monthData = summary.monthly[monthKey];
    const dataPoint: Record<string, any> = { month: monthKey }; // eslint-disable-line @typescript-eslint/no-explicit-any

    allCatIds.forEach((catId) => {
      dataPoint[catId] =
        monthData.consumptionCategory[catId]?.totalEmissions || 0;
    });
    return dataPoint;
  });

  const seriesConfig = allCatIds.map((catId) => {
    let catName = "Cargando...";
    if (!isLoading) {
      const cat = categoryMap.get(catId);
      catName = cat ? cat.translations?.ES?.name || cat.name : catId;
    }
    return {
      dataKey: catId,
      name: catName,
      stroke: colorMap[catId],
      gradientId: `color-${catId}`,
    };
  });

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
      <h2 className="text-xl font-semibold mb-10 text-gray-700">
        Evolución Mensual de Emisiones por Gasto
      </h2>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex flex-row space-x-4 mb-4">
          {seriesConfig.map((serie) => (
            <div key={serie.dataKey} className="flex items-center">
              <div
                className="w-4 h-4 mr-2 rounded"
                style={{ backgroundColor: serie.stroke }}
              ></div>
              <span className="text-sm whitespace-nowrap">{serie.name}</span>
            </div>
          ))}
        </div>
      </div>

      {chartData.length > 0 ? (
        <GenericAreaChart
          data={chartData}
          series={seriesConfig}
          chartType="bar"
        />
      ) : (
        <div>No hay datos mensuales disponibles.</div>
      )}
    </div>
  );
};

export default ConsumptionEvolution;
