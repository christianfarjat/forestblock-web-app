import React from "react";
import ScopeChart from "@/components/charts/ScopeChart";
import { ScopeData } from "@/app/dashboard/types";
import { COLORS } from "@/constants";

interface BuildingsTabProps {
  buildingChartData: ScopeData[];
  seriesKeys: string[];
  colors: Record<string, string>;
}

const BuildingsTab: React.FC<BuildingsTabProps> = ({ buildingChartData }) => {
  return (
    <>
      <ScopeChart data={buildingChartData} colors={COLORS} />
    </>
  );
};

export default BuildingsTab;
