import React from "react";
import MonthlyChartCategories from "@/components/charts/MonthlyChartCategories";
import { useCategoriesTransformation } from "@/hooks/useCategoriesTransformation";
import {
  DashboardCategory,
} from "@/app/dashboard/types";
import { Category } from "@/hooks/useCategories";

interface CategoryTabProps {
  monthlyData: Record<
    string,
    { emissions: number; category: Record<string, number> }
  >;
  dashboardCategories: Record<string, DashboardCategory>;
  dynamicCategories: Category[];
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  monthlyData,
  dashboardCategories,
  dynamicCategories,
}) => {
  const { pieCategoryData, transformedMonthlyData } =
    useCategoriesTransformation(
      monthlyData,
      dashboardCategories,
      dynamicCategories
    );

  const seriesKeys: string[] = [
    ...pieCategoryData.map((data) => data.name),
    "further",
  ];
  const colors: Record<string, string> = {};
  pieCategoryData.forEach((data) => {
    colors[data.name] = data.color;
  });
  colors["further"] = "#cccccc";

  return (
    <>
      {/* Optionally, you can add a pie/donut chart component here */}
      <MonthlyChartCategories
        data={transformedMonthlyData}
        seriesKeys={seriesKeys}
        colors={colors}
      />
    </>
  );
};

export default CategoryTab;
