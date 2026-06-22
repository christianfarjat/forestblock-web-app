"use client";

import React from "react";
import Button from "@/components/Marketplace/Button";
import { StepFuelProps } from "./types";
import { FUEL_SPECIFICATION_MAP } from "@/constants";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import StepContainer from "../StepContainer";

const StepFuel: React.FC<StepFuelProps> = ({ formData, setFormData }) => {
  const recalcValue = (distance: number, consumption: number) => {
    const dist = isNaN(distance) ? 0 : distance;
    const cons = isNaN(consumption) ? 0 : consumption;
    return (dist / 100) * cons;
  };

  const handleInputChange = (name: string, value: string | number) => {
    let newFormData = {
      ...formData,
      [name]: value,
    };

    if (name === "distance" || name === "consumption") {
      const distance =
        name === "distance" ? Number(value) : Number(formData.distance);
      const consumption =
        name === "consumption" ? Number(value) : Number(formData.consumption);
      newFormData = {
        ...newFormData,
        value: recalcValue(distance, consumption),
      };
    }

    setFormData(newFormData);
  };

  const handleFuelTypeChange = (option: string) => {
    setFormData({
      ...formData,
      fuelType: option,
      specification: FUEL_SPECIFICATION_MAP[option],
      value: recalcValue(
        Number(formData.distance),
        Number(formData.consumption)
      ),
      unit: "liters",
    });
  };

  return (
    <StepContainer>
      <StepTitle title="Combustibles" />
      <div>
        <StepLabel text="Selecciona el tipo de combustible" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["Gasoline", "E10", "E85", "Diesel"].map((option) => (
            <Button
              key={option}
              variant="primary"
              selected={formData.fuelType === option}
              onClick={() => handleFuelTypeChange(option)}
              className="w-full"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <StepLabel text="Distancia en kilómetros" isRequired />
          <FormattedNumberInput
            value={formData.distance}
            onChange={(val) => handleInputChange("distance", Number(val))}
            min={1}
            className="border p-2 w-full"
            placeholder="Kilómetros"
          />
        </div>
        <div>
          <StepLabel text="Consumo medio (litros / 100 km)" isRequired />
          <FormattedNumberInput
            value={formData.consumption}
            onChange={(val) => handleInputChange("consumption", Number(val))}
            min={1}
            className="border p-2 w-full"
            placeholder="Litros / 100 km"
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default StepFuel;
