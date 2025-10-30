/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { StepElectricityProps } from "./types";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import StepContainer from "../StepContainer";

const StepElectricity: React.FC<StepElectricityProps> = ({
  formData,
  setFormData,
}) => {
  const handleInputChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <StepContainer>
      <StepTitle title="Electricidad" />
      <div className="mb-4">
        <StepLabel text="Selecciona la unidad de medida" />
        <select
          name="unit"
          value={formData.unit}
          onChange={(e) => handleInputChange("unit", e.target.value)}
          className="border p-2 w-full rounded-full text-customGray"
        >
          <option value="kWh">kWh</option>
        </select>
      </div>
      <div className="mb-4">
        <StepLabel text="Consumo de energía" isRequired />
        <FormattedNumberInput
          value={formData.value || ""}
          onChange={(val) => handleInputChange("value", val)}
          placeholder="Ingresa el consumo de energía"
          className="border p-2 w-full"
        />
      </div>
    </StepContainer>
  );
};

export default StepElectricity;
