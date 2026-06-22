import {
  DashboardCategory,
  MonthlyEmissionData,
  ScopeData,
} from "@/app/dashboard/types";
import { Category } from "@/hooks/useCategories";
import { Building } from "./buildings";
import { MonthlyDataAlcance } from "@/components/DashboardTabs/DashboardTabs";

export interface UseDashboardTransformationsProps {
  monthlyRawData: Record<string, MonthlyEmissionData>;
  dashboardCategories: Record<string, DashboardCategory>;
  dynamicCategories: Category[];
  buildings: Building[];
  selectedYear: number;
  scopeData: {
    monthlyData: MonthlyDataAlcance[];
    scopeChartData: ScopeData[];
    yearComparisonData: Array<{
      month: string;
      currentYear: number;
      previousYear: number;
    }>;
  };
  scopes: Record<string, { name: string; emissions: number }>;
}

export interface TransformationsReturn {
  monthlyDataAlcance: MonthlyDataAlcance[];
  hasMonthlyDataAlcance: boolean;
  scopeChartDataAlcance: ScopeData[];
  topCategoryDataForPie: PieCategoryData[];
  monthlyDataCategoriasTransformed: MonthlyCategoryRecord[];
  monthlyColors: Record<string, string>;
  seriesKeys: string[];
  buildingChartData: ScopeData[];
  monthlyDataBuildings: { [key: string]: string | number; month: string }[];
  seriesKeysBuildings: string[];
}
