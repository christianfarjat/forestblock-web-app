"use client";

import React from "react";
import GenericDonutChart from "@/components/charts/GenericDonutChart";
import { ConsumptionCategoryChartProps } from "./types";
import useCategories, { Category } from "@/hooks/useCategories";
import { DonutDataItem } from "../charts/types";
import { COLORS } from "@/constants";

const ConsumptionCategoryChart: React.FC<ConsumptionCategoryChartProps> = ({
  summary,
}) => {
  const { categories, isLoading } = useCategories();
  const categoriesArray = Array.isArray(categories)
    ? categories
    : categories && typeof categories === "object" && "data" in categories
    ? (categories as { data: Category[] }).data
    : [];

  function pickColor(i: number): string {
    return COLORS[i % COLORS.length];
  }

  const chartData: DonutDataItem[] = Object.entries(
    summary.consumptionCategory
  ).map(([catId, catData], index) => {
    let label = "Cargando...";
    if (!isLoading) {
      const category = categoriesArray.find(
        (cat: Category) => cat.id === catId
      );
      label = category ? category.translations?.ES?.name || category.name : "";
    }
    return {
      name: label,
      value: catData.totalEmissions,
      color: pickColor(index),
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4">
        Emisiones por categoría (Consumos)
      </h3>
      {chartData.length > 0 ? (
        <div className="mt-10 sm:mt-0">
          <GenericDonutChart data={chartData} />
        </div>
      ) : (
        <p>No hay datos de categorías</p>
      )}
    </div>
  );
};

export default ConsumptionCategoryChart;
