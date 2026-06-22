import { useMemo } from "react";
import { Category } from "@/hooks/useCategories";
import {
  DashboardCategory,
  MonthlyCategoryRecord,
  PieCategoryData,
} from "@/app/dashboard/types";

export const useCategoriesTransformation = (
  monthlyData: Record<
    string,
    { emissions: number; category: Record<string, number> }
  >,
  dashboardCategories: Record<string, DashboardCategory>,
  dynamicCategories: Category[]
) => {
  return useMemo(() => {
    // Sort dashboard category keys by emissions in descending order
    const dashboardCategoryKeys = Object.keys(dashboardCategories).sort(
      (a, b) =>
        dashboardCategories[b].emissions - dashboardCategories[a].emissions
    );

    // Select the top 5 categories
    const topCategoryKeys = dashboardCategoryKeys.slice(0, 5);
    const displayMapping: Record<string, string> = {};

    topCategoryKeys.forEach((key) => {
      const dynamicCategory = dynamicCategories.find((cat) => cat.code === key);
      displayMapping[key] =
        dynamicCategory?.name || dashboardCategories[key].name || key;
    });

    // Prepare pie chart data for categories
    const pieCategoryData: PieCategoryData[] = topCategoryKeys.map((key) => {
      const cat = dashboardCategories[key];
      const dynamicCategory = dynamicCategories.find((c) => c.code === key);
      return {
        name: displayMapping[key],
        value: cat.emissions,
        color: dynamicCategory?.color || cat.color || "#8884d8",
      };
    });

    // Sum emissions for the remaining categories
    const othersValue = dashboardCategoryKeys
      .slice(5)
      .reduce((acc, key) => acc + (dashboardCategories[key].emissions || 0), 0);
    pieCategoryData.push({
      name: `+${dashboardCategoryKeys.length - 5} More`,
      value: othersValue,
      color: "#cccccc",
    });

    // Transform monthly data for a stacked area chart
    const transformedMonthlyData: MonthlyCategoryRecord[] = Object.keys(
      monthlyData
    ).map((month) => {
      const categoryData = monthlyData[month]?.category || {};
      const record: MonthlyCategoryRecord = { month };
      let others = 0;
      Object.keys(categoryData).forEach((key) => {
        if (topCategoryKeys.includes(key)) {
          const displayName = displayMapping[key];
          record[displayName] = categoryData[key];
        } else {
          others += categoryData[key];
        }
      });
      record["further"] = others;
      topCategoryKeys.forEach((key) => {
        const displayName = displayMapping[key];
        if (record[displayName] === undefined) {
          record[displayName] = 0;
        }
      });
      return record;
    });

    return { pieCategoryData, transformedMonthlyData };
  }, [monthlyData, dashboardCategories, dynamicCategories]);
};
