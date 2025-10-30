import { VehicleDashboardSummary } from "@/types/vehicles";

export interface VehicleFuelChartProps {
  summary: VehicleDashboardSummary | undefined;
  fuelIdToNameMap: Record<string, string>;
}
