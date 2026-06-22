/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { StepCarJourneyProps } from "./types";
import { SPECIFICATION_OPTIONS, DETAIL_OPTIONS } from "@/constants/index";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";
import StepContainer from "../StepContainer";

const StepCarJourney: React.FC<StepCarJourneyProps> = ({
  formData,
  setFormData,
}) => {
  const handleInputChange = (name: string, value: any) => {
    if (name === "value") {
      setFormData({
        ...formData,
        unit: "kilometers",
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <StepContainer>
      <StepTitle title="Viaje en coche" />
      <div>
        <StepLabel text="Clase de vehículo" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SPECIFICATION_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`px-4 py-2 rounded ${
                formData.specification === value
                  ? "bg-customGreen text-black"
                  : "bg-gray-200"
              }`}
              onClick={() => handleInputChange("specification", value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de motor */}
      <div className="mt-4">
        <StepLabel text="Tipo de motor" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DETAIL_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`px-4 py-2 rounded ${
                formData.detail === value
                  ? "bg-customGreen text-black"
                  : "bg-gray-200"
              }`}
              onClick={() => handleInputChange("detail", value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <FormattedNumberInput
          value={formData.value || ""}
          onChange={(val) => handleInputChange("value", val)}
          min={1}
          placeholder="Ingresa el valor en kilómetros"
          className="border p-2 w-full"
          required
        />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <label className="block text-customGray">¿Viaje de ida y vuelta?</label>
        <input
          type="checkbox"
          name="return_trip"
          checked={formData.return_trip}
          onChange={(e) => handleInputChange("return_trip", e.target.checked)}
          className="border p-2"
        />
      </div>
    </StepContainer>
  );
};

export default StepCarJourney;
