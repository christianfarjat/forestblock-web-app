"use client";

import React, { useMemo } from "react";
import DataCard from "@/components/DataCard/DataCard";
import useCategories, { Category } from "@/hooks/useCategories";
import { convertToEUR } from "@/utils/convertToEUR";
import { ConsumptionsSummaryProps } from "./types";

const ConsumptionsSummary: React.FC<ConsumptionsSummaryProps> = ({
  consumptions,
}) => {
  const { categories, isLoading } = useCategories();

  const categoriesArray = useMemo(() => {
    if (Array.isArray(categories)) {
      return categories;
    } else if (
      categories &&
      typeof categories === "object" &&
      "data" in categories
    ) {
      return (categories as { data: Category[] }).data;
    }
    return [];
  }, [categories]);

  const {
    totalExpenditureInEUR,
    emissionsPerEuro,
    categoryWithMaxImpact,
    ratioMaxImpact,
  } = useMemo(() => {
    let totalExpenditureInEUR = 0;
    let totalEmissions = 0;

    const categoriesMap: Record<
      string,
      { costEUR: number; emissions: number }
    > = {};

    for (const item of consumptions) {
      const costInEUR = convertToEUR(
        item.totalCost,
        item.currency,
        item.extraData
      );
      totalExpenditureInEUR += costInEUR;

      const emissionValue = item.emission?.emission ?? 0;
      totalEmissions += emissionValue;

      const catId = item.categoryId || "sin-categoría";
      if (!categoriesMap[catId]) {
        categoriesMap[catId] = { costEUR: 0, emissions: 0 };
      }
      categoriesMap[catId].costEUR += costInEUR;
      categoriesMap[catId].emissions += emissionValue;
    }

    const emissionsPerEuro =
      totalExpenditureInEUR > 0 ? totalEmissions / totalExpenditureInEUR : 0;

    let maxCategoryId = "";
    let maxRatio = 0;

    for (const [catId, data] of Object.entries(categoriesMap)) {
      if (data.costEUR > 0) {
        const ratio = data.emissions / data.costEUR;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxCategoryId = catId;
        }
      }
    }

    return {
      totalExpenditureInEUR,
      emissionsPerEuro,
      categoryWithMaxImpact: maxCategoryId,
      ratioMaxImpact: maxRatio,
    };
  }, [consumptions]);

  const categoryImpactName = useMemo(() => {
    if (isLoading) return "Cargando...";
    const categoryFound = categoriesArray.find(
      (cat: Category) => cat.id === categoryWithMaxImpact
    );
    return categoryFound
      ? categoryFound.translations?.ES?.name || categoryFound.name
      : "N/A";
  }, [categoriesArray, categoryWithMaxImpact, isLoading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <DataCard
        title="Gasto total"
        value={totalExpenditureInEUR.toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        unit="€"
        variant="primary"
      />
      <DataCard
        title="Emisiones por euro"
        value={emissionsPerEuro.toLocaleString("es-ES", {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        })}
        unit="t CO₂e/€"
      />
      <DataCard
        title="Categoría con mayor impacto"
        value={ratioMaxImpact.toLocaleString("es-ES", {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        })}
        unit={`t CO2e por euro en (${categoryImpactName})`}
      />
    </div>
  );
};

export default ConsumptionsSummary;
