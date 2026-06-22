/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  FaPlane,
  FaCar,
  FaBus,
  FaTrain,
  FaHotel,
  FaGasPump,
  FaBolt,
  FaTint,
} from "react-icons/fa";

import StepAirTravel from "./steps/StepAirTravel";
import StepCarJourney from "./steps/StepCarJourney";
import StepBusTrip from "./steps/StepBusTrip";
import StepTrainJourney from "./steps/StepTrainJourney";
import StepHotelStay from "./steps/StepHotelStay";
import StepFuel from "./steps/StepFuel";

import StepElectricity from "./steps/StepElectricity";
import StepWaterConsumption from "./steps/StepWaterConsumption";
import { StepAirTravelData, StepFuelData } from "./steps/types";
import {
  CalculationType,
  CarJourneyEntry,
  TrainJourneyEntry,
} from "@/types/calculator";

export const steps = [
  {
    id: "airTravel",
    label: "Transporte aéreo",
    component: StepAirTravel,
    icon: <FaPlane />,
    entryType: "airTravel" as const,
    defaultData: {
      specification: "",
      detail: "",
      departure: "",
      destination: "",
      return_trip: true,
      passengers: "",
      activity: "flights",
      type: CalculationType.TRAVEL_AIR,
    } as StepAirTravelData,
  },
  {
    id: "carJourney",
    label: "Viaje en coche",
    component: StepCarJourney,
    icon: <FaCar />,
    entryType: "carJourney" as const,
    defaultData: {
      specification: "average",
      detail: "average",
      return_trip: true,
      activity: "cars_by_market_segment",
      unit: "kilometers",
      value: "",
      type: CalculationType.TRAVEL_LAND,
    } as CarJourneyEntry,
  },
  {
    id: "busTrip",
    label: "Viaje en autobús",
    component: StepBusTrip,
    icon: <FaBus />,
    defaultData: {
      type: CalculationType.TRAVEL_LAND,
      activity: "bus",
      specification: "local_bus",
      unit: "passenger.kilometers",
      value: "",
    } as any,
  },
  {
    id: "trainJourney",
    label: "Viaje en tren",
    component: StepTrainJourney,
    icon: <FaTrain />,
    entryType: "trainJourney" as const,
    defaultData: {
      type: CalculationType.TRAVEL_LAND,
      activity: "rail",
      specification: "average",
      value: "",
      unit: "passenger.kilometers",
      distance: "",
      passengers: "",
      round_trip: true,
    } as TrainJourneyEntry,
  },
  {
    id: "hotelStay",
    label: "Estancia en hotel",
    component: StepHotelStay,
    icon: <FaHotel />,
    defaultData: {
      activity: "average",
      overnightStays: "",
      value: "",
      rooms: "",
      type: CalculationType.HOTEL_STAY,
    } as any,
  },
  {
    id: "fuel",
    label: "Combustible",
    component: StepFuel,
    icon: <FaGasPump />,
    defaultData: {
      fuelType: "Gasoline",
      distance: "",
      consumption: "",
      specification: "petrol_average_biofuel_blend",
      value: "",
      unit: "liters",
      type: CalculationType.FUELS,
    } as StepFuelData,
  },
  {
    id: "electricityConsumption",
    label: "Electricidad",
    component: StepElectricity,
    icon: <FaBolt />,
    defaultData: {
      type: CalculationType.ELECTRICITY_CONSUMPTION,
      value: 0,
      unit: "kWh",
    },
    entryType: "electricityConsumption" as const,
  },
  {
    id: "waterSupply",
    label: "Consumo de agua",
    component: StepWaterConsumption,
    icon: <FaTint />,
    entryType: "waterSupply" as const,
    defaultData: { type: "water_supply", value: 0, unit: "cubic meters" },
  },
];
