import { useMemo } from "react";
import { transformCategoryData } from "@/utils/transformations";
import { transformBuildingData } from "@/utils/transformBuildingData";

import { Category } from "@/hooks/useCategories";
import { MonthlyCategoryRecord } from "@/app/dashboard/types";
import {
  TransformationsReturn,
  UseDashboardTransformationsProps,
} from "@/types/useDashboardTransformations";

export const useDashboardTransformations = ({
  monthlyRawData,
  dashboardCategories,
  dynamicCategories,
  scopeData,
}: UseDashboardTransformationsProps): TransformationsReturn => {
  const { monthlyData, scopeChartData } = scopeData;

  // Transformación para alcance
  const monthlyDataAlcance = monthlyData;
  const hasMonthlyDataAlcance =
    monthlyDataAlcance && monthlyDataAlcance.length > 0;
  const scopeChartDataAlcance = scopeChartData;

  // Transformación para categorías
  const { topCategoryKeys, keyDisplayMapping, topCategoryDataForPie } =
    transformCategoryData(dashboardCategories, dynamicCategories);

  const monthlyDataCategoriasTransformed: MonthlyCategoryRecord[] =
    useMemo(() => {
      return Object.keys(monthlyRawData).map((month) => {
        const catData =
          (monthlyRawData[month] && "category" in monthlyRawData[month]
            ? (monthlyRawData[month].category as Record<string, number>)
            : {}) || {};
        const record: MonthlyCategoryRecord = { month };
        let others = 0;
        for (const key of Object.keys(catData)) {
          if (topCategoryKeys.includes(key)) {
            const displayName = keyDisplayMapping[key];
            record[displayName] = catData[key];
          } else {
            others += catData[key];
          }
        }
        record["further"] = others;
        for (const key of topCategoryKeys) {
          const displayName = keyDisplayMapping[key];
          if (record[displayName] === undefined) {
            record[displayName] = 0;
          }
        }
        return record;
      });
    }, [monthlyRawData, topCategoryKeys, keyDisplayMapping]);

  const monthlyColors: Record<string, string> = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const key of topCategoryKeys) {
      const displayName = keyDisplayMapping[key];
      const dynCat: Category | undefined = Array.isArray(dynamicCategories)
        ? dynamicCategories.find((c: Category) => c.code === key)
        : Object.values(dynamicCategories as Record<string, Category>).find(
            (c) => c.code === key
          );
      colors[displayName] =
        dynCat?.color || dashboardCategories[key].color || "#8884d8";
    }
    colors.further = "#cccccc";
    return colors;
  }, [
    topCategoryKeys,
    keyDisplayMapping,
    dynamicCategories,
    dashboardCategories,
  ]);

  const seriesKeys: string[] = [...Object.values(keyDisplayMapping), "further"];

  const { buildingChartData, monthlyDataBuildings, seriesKeysBuildings } =
    transformBuildingData(monthlyRawData);

  return {
    monthlyDataAlcance,
    hasMonthlyDataAlcance,
    scopeChartDataAlcance,
    topCategoryDataForPie,
    monthlyDataCategoriasTransformed,
    monthlyColors,
    seriesKeys,
    buildingChartData,
    monthlyDataBuildings,
    seriesKeysBuildings,
  };
};
