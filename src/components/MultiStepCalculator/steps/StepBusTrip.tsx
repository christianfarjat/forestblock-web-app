"use client";

import React from "react";
import Button from "@/components/Marketplace/Button";
import { StepBusTripProps } from "./types";
import { BUS_SPEC_OPTIONS, TRIP_TYPE_OPTIONS } from "@/constants";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import StepContainer from "../StepContainer";

const StepBusTrip: React.FC<StepBusTripProps> = ({ formData, setFormData }) => {
  const handleSpecificationClick = (
    spec: "local_bus" | "coach" | "average_local_bus" | "average"
  ) => {
    setFormData({
      ...formData,
      specification: spec,
    });
  };

  const handleTripTypeClick = (roundTrip: boolean) => {
    setFormData({
      ...formData,
      return_trip: roundTrip,
    });
  };

  const handlePassengersChange = (value: number) => {
    setFormData({
      ...formData,
      passengers: value,
    });
  };

  const handleValueChange = (value: number) => {
    setFormData({
      ...formData,
      unit: "passenger.kilometers",
      value: value,
    });
  };

  return (
    <StepContainer>
      <StepTitle title="Viaje en autobús" />
      <div>
        <StepLabel text="Tipo de autobús" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BUS_SPEC_OPTIONS.map(({ label, value }) => (
            <Button
              key={value}
              variant="primary"
              className="w-full"
              selected={formData.specification === value}
              onClick={() =>
                handleSpecificationClick(
                  value as
                    | "local_bus"
                    | "coach"
                    | "average_local_bus"
                    | "average"
                )
              }
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tipo de viaje */}
      <div className="mt-4">
        <StepLabel text="Tipo de viaje" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TRIP_TYPE_OPTIONS.map(({ label, value }) => (
            <Button
              key={label}
              variant="primary"
              className="w-full"
              selected={formData.return_trip === value}
              onClick={() => handleTripTypeClick(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <StepLabel text="Distancia en kilómetros" isRequired />
          <FormattedNumberInput
            value={formData.value || ""}
            onChange={(value) => handleValueChange(Number(value))}
            min={1}
            placeholder="Ingresa la distancia"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <StepLabel text="Pasajeros" />
          <FormattedNumberInput
            value={formData.passengers ?? ""}
            onChange={(value) => handlePassengersChange(Number(value))}
            min={1}
            placeholder="Número de pasajeros"
            className="border p-2 w-full"
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default StepBusTrip;
