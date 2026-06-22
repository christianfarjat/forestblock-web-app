"use client";

import React, { useCallback } from "react";
import airportsJson from "@/constants/airports.json";
import { Airport, Option, StepAirTravelProps } from "./types";
import { getAirportAddress } from "@/utils/airport";
import {
  detailAirLabels,
  detailAirOptionsMapping,
  specificationAirLabels,
  specificationAirOptions,
} from "@/constants";
import AirportSelect from "../AirportSelect";
import SelectField from "../SelectField";
import FormattedNumberInput from "@/components/FormattedNumberInput/FormattedNumberInput";
import StepContainer from "../StepContainer";
import StepTitle from "../StepTitle";
import StepLabel from "../StepLabel";

const airportsData = airportsJson as Record<string, Airport>;
const airportsArray: Airport[] = Object.values(airportsData);

const createAirportOptions = (airports: Airport[]): Option[] =>
  airports.map((airport) => ({
    label: `${airport.name} (${airport.city}, ${airport.state}, ${airport.country})`,
    value: getAirportAddress(airport),
  }));

const StepAirTravel: React.FC<StepAirTravelProps> = ({
  formData,
  setFormData,
}) => {
  const currentSpecification = formData.specification || "average";
  const detailOptions = detailAirOptionsMapping[currentSpecification] || [];
  const airportOptions = createAirportOptions(airportsArray);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const newValue =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : value;
      setFormData({ ...formData, [name]: newValue });
    },
    [formData, setFormData]
  );

  return (
    <StepContainer>
      <StepTitle title="Viaje en avión" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <StepLabel text="Selecciona el aeropuerto de salida" isRequired />
          <AirportSelect
            label="Salida"
            value={formData.departure || ""}
            options={airportOptions}
            onChange={(value) => setFormData({ ...formData, departure: value })}
            placeholder="Aeropuerto de salida"
            isRequired={true}
          />
        </div>
        <div>
          <StepLabel text="Selecciona el aeropuerto de destino" isRequired />
          <AirportSelect
            label="Destino"
            value={formData.destination || ""}
            options={airportOptions}
            onChange={(value) =>
              setFormData({ ...formData, destination: value })
            }
            placeholder="Aeropuerto de destino"
            isRequired={true}
          />
        </div>
        <div>
          <StepLabel text="Tipo de vuelo" />
          <SelectField
            label="Seleccionar tipo de vuelo"
            name="specification"
            value={formData.specification}
            options={specificationAirOptions}
            labelsMapping={specificationAirLabels}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <StepLabel text="Clase de vuelo" />
          <SelectField
            label="Seleccionar clase"
            name="detail"
            value={formData.detail}
            options={detailOptions}
            labelsMapping={detailAirLabels}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="block text-customGray">
            ¿Viaje de ida y vuelta?
          </label>
          <input
            type="checkbox"
            name="return_trip"
            checked={
              formData.return_trip !== undefined ? formData.return_trip : true
            }
            onChange={handleInputChange}
            className="border p-2"
          />
        </div>
        <div>
          <StepLabel text="Pasajeros" />
          <FormattedNumberInput
            placeholder="Ingresa el número de pasajeros"
            value={formData.passengers || ""}
            onChange={(val) => setFormData({ ...formData, passengers: val })}
            min={1}
            className="border p-2 w-full"
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default StepAirTravel;
