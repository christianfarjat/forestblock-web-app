"use client";

import React from "react";
import { StepHotelStayProps } from "./types";
import { HOTEL_OPTIONS } from "@/constants";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import StepContainer from "../StepContainer";

const StepHotelStay: React.FC<StepHotelStayProps> = ({
  formData,
  setFormData,
}) => {
  const handleActivityChange = (value: string) => {
    setFormData({ ...formData, activity: value });
  };

  const handleOvernightStaysChange = (value: number) => {
    setFormData({ ...formData, overnightStays: value });
  };

  const handleRoomsChange = (value: number) => {
    setFormData({ ...formData, rooms: value });
  };

  return (
    <StepContainer>
      <StepTitle title="Estadía en el hotel" />
      <div>
        <StepLabel text="Selecciona el país del hotel" />
        <select
          name="activity"
          value={formData.activity || ""}
          onChange={(e) => handleActivityChange(e.target.value)}
          className="border p-2 w-full rounded-full text-customGray"
        >
          <option value="">Selecciona...</option>
          {HOTEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <StepLabel text="Cantidad de noches" isRequired />
          <FormattedNumberInput
            value={formData.overnightStays ?? 1}
            onChange={(val) => handleOvernightStaysChange(Number(val))}
            min={1}
            className="border p-2 w-full"
            placeholder="Ingresa la cantidad de noches"
          />
        </div>
        <div>
          <StepLabel text="Número de habitaciones" isRequired />
          <FormattedNumberInput
            style={{
              borderRadius: "9999px",
            }}
            value={formData.rooms ?? 1}
            onChange={(val) => handleRoomsChange(Number(val))}
            min={1}
            className="border p-2 w-full"
            placeholder="Ingresa el número de habitaciones"
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default StepHotelStay;
