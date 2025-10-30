import React from "react";
import EvolutionChart from "../charts/EvolutionChart";

const Evolution = ({
  yearComparisonData,
}: {
  yearComparisonData: Array<{
    month: string;
    currentYear: number;
    previousYear: number;
  }>;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-10">
      <h2 className="text-xl font-semibold mb-10 text-gray-700">
        Evolución vs Periodo Anterior
      </h2>
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#89CCC5" }}
          ></div>
          <span className="text-gray-500">Periodo actual</span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#E2B370" }}
          ></div>
          <span className="text-gray-500">Periodo anterior</span>
        </div>
      </div>
      <EvolutionChart data={yearComparisonData} />
    </div>
  );
};

export default Evolution;
