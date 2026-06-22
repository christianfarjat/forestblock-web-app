"use client";

import React from "react";
import { WaterSupplyEntry } from "@/types/calculator";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import StepContainer from "../StepContainer";

interface StepWaterConsumptionProps {
  formData: WaterSupplyEntry;
  setFormData: React.Dispatch<React.SetStateAction<WaterSupplyEntry>>;
}

const StepWaterConsumption: React.FC<StepWaterConsumptionProps> = ({
  formData,
  setFormData,
}) => {
  const handleValueChange = (value: string | number) => {
    setFormData({
      ...formData,
      value: Number(value),
    });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      unit: value as "liters" | "cubic meters" | "cubic inches" | "gallons",
    });
  };

  return (
    <StepContainer>
      <StepTitle title="Consumo de agua" />
      <div className="mt-4">
        <StepLabel text="Selecciona la unidad de medida" />
        <select
          name="unit"
          value={formData.unit}
          onChange={handleUnitChange}
          className="border p-2 w-full rounded-full text-customGray"
        >
          <option value="cubic meters">Metros cúbicos</option>
          <option value="liters">Litros</option>
          <option value="cubic inches">Pulgadas cúbicas</option>
          <option value="gallons">Galones</option>
        </select>
      </div>
      <div className="mt-4">
        <StepLabel text="Consumo de agua" isRequired />
        <FormattedNumberInput
          value={formData.value || ""}
          onChange={(val) => handleValueChange(val)}
          placeholder="Ingresa el consumo de agua"
          className="border p-2 w-full"
        />
      </div>
    </StepContainer>
  );
};

export default StepWaterConsumption;
