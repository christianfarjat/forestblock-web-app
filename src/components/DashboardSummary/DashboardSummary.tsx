import React from "react";
import DataCard from "@/components/DataCard/DataCard";

interface DashboardSummaryProps {
  totalEmissions: number;
  count: number;
  totalConsumptions: number | undefined;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalEmissions,
  count,
  totalConsumptions,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <DataCard
      title="Emisiones totales"
      value={totalEmissions.toFixed(2)}
      unit="t CO₂e"
      variant="primary"
    />
    <DataCard
      title="Emisiones por empleado"
      value={(totalEmissions / count).toFixed(2)}
      unit="t CO₂e"
    />
    <DataCard
      title="Total de consumos"
      value={totalConsumptions?.toFixed(2)}
      unit="kWh"
    />
  </div>
);

export default DashboardSummary;
