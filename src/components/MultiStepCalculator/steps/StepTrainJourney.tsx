"use client";

import React from "react";
import Button from "@/components/Marketplace/Button";
import { StepTrainJourneyProps } from "./types";
import { TRAIN_TRIP_TYPE_OPTIONS, TRAIN_TYPE_OPTIONS } from "@/constants";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import StepContainer from "../StepContainer";

const StepTrainJourney: React.FC<StepTrainJourneyProps> = ({
  formData,
  setFormData,
}) => {
  const recalcValue = (
    distance: number,
    passengers: number,
    round_trip: boolean
  ) => {
    const multiplier = round_trip ? 2 : 1;
    return distance * passengers * multiplier;
  };

  const handleSpecificationClick = (spec: string) => {
    setFormData({
      ...formData,
      specification: spec,
      value: recalcValue(
        formData.distance,
        formData.passengers,
        formData.round_trip
      ),
    });
  };

  const handleRoundTripClick = (roundTrip: boolean) => {
    setFormData({
      ...formData,
      round_trip: roundTrip,
      value: recalcValue(formData.distance, formData.passengers, roundTrip),
    });
  };

  const handleDistanceChange = (newDistance: number) => {
    setFormData({
      ...formData,
      distance: newDistance,
      value: recalcValue(newDistance, formData.passengers, formData.round_trip),
    });
  };

  const handlePassengersChange = (newPassengers: number) => {
    setFormData({
      ...formData,
      passengers: newPassengers,
      value: recalcValue(formData.distance, newPassengers, formData.round_trip),
    });
  };

  return (
    <StepContainer>
      <StepTitle title="Viaje en tren" />
      {/* Tipo de tren */}
      <div>
        <StepLabel text="Tipo de tren" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TRAIN_TYPE_OPTIONS.map(({ label, value }) => (
            <Button
              key={value}
              variant="primary"
              className="w-full"
              selected={formData.specification === value}
              onClick={() => handleSpecificationClick(value)}
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
          {TRAIN_TRIP_TYPE_OPTIONS.map(({ label, value }) => (
            <Button
              key={label}
              variant="primary"
              selected={formData.round_trip === value}
              className="w-full"
              onClick={() => handleRoundTripClick(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Distancia y Pasajeros */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <StepLabel text="Distancia en kilómetros" isRequired />
          <FormattedNumberInput
            value={formData.distance}
            onChange={(val) => handleDistanceChange(Number(val))}
            min={1}
            className="border p-2 w-full"
            placeholder="Distancia en kilómetros"
          />
        </div>
        <div>
          <StepLabel text="Pasajeros" isRequired />
          <FormattedNumberInput
            value={formData.passengers}
            onChange={(val) => handlePassengersChange(Number(val))}
            min={1}
            className="border p-2 w-full"
            placeholder="Número de pasajeros"
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default StepTrainJourney;
