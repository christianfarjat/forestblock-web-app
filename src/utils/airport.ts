import { Airport } from "@/components/MultiStepCalculator/steps/types";

export const getAirportAddress = (airport: Airport): string => {
  if (
    airport.city &&
    airport.state &&
    airport.country &&
    airport.city.trim() !== "" &&
    airport.state.trim() !== "" &&
    airport.country.trim() !== ""
  ) {
    return `${airport.city}, ${airport.state}, ${airport.country}`;
  }
  if (airport.iata && airport.iata.trim() !== "") {
    return airport.iata;
  }
  if (airport.icao && airport.icao.trim() !== "") {
    return airport.icao;
  }
  return airport.name;
};
