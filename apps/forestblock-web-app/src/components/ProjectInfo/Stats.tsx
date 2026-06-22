import React from "react";
import { Stats } from "@/types/project";
import InfoTooltip from "./InfoTooltip";

const StatsCard = ({ stats }: { stats: Stats }) => {
  const retiredCredits = stats.totalRetired?.toFixed(0);
  const remainingSupply = stats.totalSupply?.toFixed(0);
  const totalSupply = stats.totalRetired + stats.totalSupply;
  const progressPercentage = (stats.totalRetired / totalSupply) * 100;

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-white rounded-lg">
      <h3 className="text-[14px] sm:text-[18px] md:text-[23px] font-aeonik font-medium mb-3">
        Datos sobre este proyecto
      </h3>
      <div className="relative h-1 bg-mintGreen rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-forestGreen"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-forestGreen"></span>
          <InfoTooltip
            text="Créditos Retirados:"
            tooltipText="Cantidad de los créditos de este activo que se han retirado."
          />
          <span className="ml-auto text-[14px] sm:text-[16px] md:text-[23px] font-aeonik font-medium">
            {retiredCredits}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-mintGreen"></span>
          <InfoTooltip
            text="Suministro Restante:"
            tooltipText="Cantidad de los créditos de este activo que se han puenteado pero aún no se han retirado."
          />
          <span className="ml-auto text-[14px] sm:text-[16px] md:text-[23px] font-aeonik font-medium">
            {remainingSupply}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
