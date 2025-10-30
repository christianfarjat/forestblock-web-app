import { Consumption, ConsumptionDashboardSummary } from "@/types/consumptions";

const useConsumptionsDashboard = () => {
  function buildConsumptionDashboardSummary(
    consumptions: Consumption[]
  ): ConsumptionDashboardSummary {
    const summary: ConsumptionDashboardSummary = {
      totalEmissions: 0,
      totalCost: 0,
      consumptionCategory: {},
      monthly: {},
    };

    consumptions.forEach((item) => {
      const emissionValue = item.emission?.emission ?? 0;
      summary.totalEmissions += emissionValue;

      const costValue = item.totalCost ?? 0;
      summary.totalCost += costValue;

      const catId = item.categoryId ?? "sin-categoria";
      if (!summary.consumptionCategory[catId]) {
        summary.consumptionCategory[catId] = {
          totalEmissions: 0,
          totalCost: 0,
          count: 0,
        };
      }
      summary.consumptionCategory[catId].totalEmissions += emissionValue;
      summary.consumptionCategory[catId].totalCost += costValue;
      summary.consumptionCategory[catId].count++;

      const start = new Date(item.startDate);
      const yearMonth = `${start.getFullYear()}-${String(
        start.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!summary.monthly[yearMonth]) {
        summary.monthly[yearMonth] = { consumptionCategory: {} };
      }
      if (!summary.monthly[yearMonth].consumptionCategory[catId]) {
        summary.monthly[yearMonth].consumptionCategory[catId] = {
          totalEmissions: 0,
          totalCost: 0,
          count: 0,
        };
      }
      summary.monthly[yearMonth].consumptionCategory[catId].totalEmissions +=
        emissionValue;
      summary.monthly[yearMonth].consumptionCategory[catId].totalCost +=
        costValue;
      summary.monthly[yearMonth].consumptionCategory[catId].count++;
    });

    return summary;
  }

  return {
    buildConsumptionDashboardSummary,
  };
};

export default useConsumptionsDashboard;
