import React from "react";
import { ScopeBreakdownProps } from "./types";

const Scopes: React.FC<ScopeBreakdownProps> = ({
  scopes,
  categories,
  totalEmissions,
}) => {
  const scopeKeys = ["scope-1", "scope-2", "scope-3"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scopeKeys.map((scopeKey) => {
        const scopeData = scopes[scopeKey];
        if (!scopeData) return null;

        const scopePercentage =
          totalEmissions > 0 ? (scopeData.emissions / totalEmissions) * 100 : 0;

        const scopeCategories = Object.values(categories).filter(
          (cat) => cat.parents?.scope === scopeData.code
        );

        return (
          <div
            key={scopeKey}
            className="bg-white p-6 rounded-xl border-2 border-gray-200 flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-2">{scopeData.name}</h3>
            <div className="flex flex-col items-center justify-center mb-4 text-center">
              <p className="text-4xl font-bold text-forestGreen mb-1">
                {scopePercentage.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mb-4">
                de tus emisiones
                <br />
                {scopeData.emissions.toLocaleString("es-ES", {
                  maximumFractionDigits: 2,
                })}{" "}
                /{" "}
                {totalEmissions.toLocaleString("es-ES", {
                  maximumFractionDigits: 2,
                })}{" "}
                tCO₂e
              </p>
            </div>
            <div className="space-y-3">
              {scopeCategories.map((cat) => {
                const catPercentage =
                  scopeData.emissions > 0
                    ? (cat.emissions / scopeData.emissions) * 100
                    : 0;

                return (
                  <div key={cat.code}>
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>{cat.name}</span>
                      <span>{catPercentage.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-[#E1F6D0] h-2 rounded-full">
                      <div
                        className="bg-[#99EE9F] h-2 rounded-full"
                        style={{ width: `${catPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Scopes;
