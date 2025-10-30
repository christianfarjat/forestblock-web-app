import { useMemo } from "react";
import {
  DashboardCategory,
  MonthlyEmissionData,
  ScopeData,
} from "@/app/dashboard/types";
import {
  transformMonthlyDataByScope,
  transformScopeData,
  transformYearComparisonData,
} from "@/utils/transformData";
import { ScopeInfo } from "@/components/ScopeTab/ScopeTab";

interface UseScopeDataParams {
  monthlyRawData: Record<string, MonthlyEmissionData>;
  dashboardCategories: Record<string, DashboardCategory>;
  scopes: Record<string, ScopeInfo>;
  selectedYear: number;
}

export const useScopeData = ({
  monthlyRawData,
  dashboardCategories,
  scopes,
  selectedYear,
}: UseScopeDataParams) => {
  return useMemo(() => {
    const monthlyData = transformMonthlyDataByScope(
      monthlyRawData,
      dashboardCategories,
      selectedYear
    );
    const scopeChartData: ScopeData[] = transformScopeData(scopes, [
      "#96CF9C",
      "#8DB7E5",
      "#E2B370",
    ]);
    const yearComparisonData = transformYearComparisonData(
      monthlyRawData,
      selectedYear,
      selectedYear - 1
    );
    return { monthlyData, scopeChartData, yearComparisonData };
  }, [monthlyRawData, dashboardCategories, scopes, selectedYear]);
};
