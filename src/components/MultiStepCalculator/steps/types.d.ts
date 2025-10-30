/* eslint-disable @typescript-eslint/no-explicit-any */

import { ListChildComponentProps } from 'react-window';
import { CalculatorResponse, MultiStepFormData } from '@/types/calculator';

export interface Airport {
  icao: string;
  iata: string | null;
  name: string;
  city: string;
  state: string;
  country: string;
  elevation: number;
  lat: number;
  lon: number;
  tz: string;
}

export interface StepAirTravelData {
  departure: string;
  destination: string;
  specification: string;
  detail: string;
  return_trip: boolean;
  passengers?: number | string;
}

export interface StepAirTravelProps {
  formData: StepAirTravelData;
  setFormData: React.Dispatch<React.SetStateAction<StepAirTravelData>>;
  type: 'travel-air';
}

export interface Option {
  label: string;
  value: string;
}

export interface VirtualizedSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface VirtualListProps {
  height: number;
  width: number | string;
  itemCount: number;
  itemSize: number;
  children: (props: ListChildComponentProps) => JSX.Element;
}

export interface MultiStepCalculatorProps {
  formData: MultiStepFormData;
  setFormData: React.Dispatch<React.SetStateAction<MultiStepFormData>>;
  addEntry: (type: keyof MultiStepFormData, defaultEntry: any) => void;
  calculate: (payload: any) => Promise<CalculatorResponse>;
  onStepComplete?: (response: CalculatorResponse) => void;
}

export interface StepCarJourneyProps {
  formData: {
    specification: string;
    detail: string;
    departure: string;
    destination: string;
    return_trip: boolean;
    value: number | string;
    unit: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      specification: string;
      detail: string;
      departure: string;
      destination: string;
      return_trip: boolean;
      value: number | string;
      unit: string;
    }>
  >;
  addEntry?: (type: 'carJourney', defaultEntry: any) => void;
}

export interface StepElectricityProps {
  formData: {
    value: string;
    unit: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      value: string;
      unit: string;
    }>
  >;
}

export interface StepTrainJourneyProps {
  formData: {
    type: string;
    activity: string;
    specification: string;
    value: number;
    unit: string;
    distance: number;
    passengers: number;
    round_trip: boolean;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      type: string;
      activity: string;
      specification: string;
      value: number;
      unit: string;
      distance: number;
      passengers: number;
      round_trip: boolean;
    }>
  >;
}

export interface StepBusTripData {
  type: 'travel-land';
  activity: 'bus';
  specification: 'local_bus' | 'average_local_bus' | 'coach' | 'average';
  departure: string;
  destination: string;
  return_trip: boolean;
  passengers: number;
  unit: string;
  value: number | string;
}

export interface StepBusTripProps {
  formData: StepBusTripData;
  setFormData: React.Dispatch<React.SetStateAction<StepBusTripData>>;
}

export interface StepHotelStayData {
  activity: string;
  overnightStays: number;
  rooms: number;
}

export interface StepHotelStayProps {
  formData: StepHotelStayData;
  setFormData: React.Dispatch<React.SetStateAction<StepHotelStayData>>;
}

export interface StepFuelData {
  fuelType: string;
  distance: number | string;
  consumption: number | string;
  specification: string;
  value: number | string;
  unit: string;
}

export interface StepFuelProps {
  formData: StepFuelData;
  setFormData: React.Dispatch<React.SetStateAction<StepFuelData>>;
}

export interface StepCPUData {
  cloudProvider: string;
  serverLocation: string;
  cpuHours: number;
  specification: string;
  detail: string;
  value: number;
  unit: string;
}

export interface StepCPUProps {
  formData: StepCPUData;
  setFormData: React.Dispatch<React.SetStateAction<StepCPUData>>;
}
