import MonthlyChart from "@/components/charts/MonthlyChart";
import MonthlyChartCategories from "@/components/charts/MonthlyChartCategories";
import MonthlyChartBuildings from "@/components/charts/MonthlyChartBuildings";
import { COLORS } from "@/constants";

export const tabConfig = {
  alcance: {
    ChartComponent: MonthlyChart,
    extraProps: { colors: "#96CF9C" },
  },
  categorias: {
    ChartComponent: MonthlyChartCategories,
    extraProps: { seriesKeys: [], colors: [COLORS] },
  },
  edificios: {
    ChartComponent: MonthlyChartBuildings,
    extraProps: { seriesKeys: [], colors: [COLORS] },
  },
};
