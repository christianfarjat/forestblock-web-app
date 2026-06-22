import { VehicleDashboardSummary } from "@/types/vehicles";

export interface VehicleCategoryChartProps {
  summary: VehicleDashboardSummary | undefined;
  categoryNames: Map<string, string>;
}