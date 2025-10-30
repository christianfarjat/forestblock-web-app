import React from "react";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import { PriceCardProps } from "./types";
import { formatNumber } from "@/utils/formatNumber";

export default function PriceCard({
  listing,
  tonnesToRetire,
  setTonnesToRetire,
  totalCost,
  disabled = false,
}: PriceCardProps) {
  const singleUnitPrice = listing?.purchasePrice;
  const availableTonnes = listing?.supply;
  const value = parseFloat(totalCost?.toFixed(2) || "0");

  return (
    <div className="p-6 bg-white border-gray-200 rounded-xl max-w-lg flex flex-col gap-5">
      <h3 className="text-[23px] font-medium font-aeonik text-forestGreen">
        Precio total
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-[19px]  text-customGray font-aeonik">
          Cantidad a retirar
        </p>
        <QuantitySelector
          value={tonnesToRetire}
          setValue={setTonnesToRetire}
          min={0.1}
          max={availableTonnes ?? 0}
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[19px] text-customGray mb-1 font-aeonik">
          Precio por tonelada
        </p>
        <p className="text-[19px] font-neueMontreal font-medium text-customGray">
          ${singleUnitPrice?.toFixed(2)}
        </p>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-[19px]  text-customGray mb-1 font-aeonik">
          Costo total
        </p>
        <p className="text-[23px] font-bold font-neueMontreal text-forestGreen">
          ${formatNumber(Number(value))}
        </p>
      </div>
    </div>
  );
}
