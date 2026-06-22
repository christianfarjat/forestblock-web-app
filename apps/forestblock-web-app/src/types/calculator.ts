import { HotelCode } from '@/constants';

export enum CalculationType {
  TRAVEL_AIR = 'travel-air',
  TRAVEL_LAND = 'travel-land',
  TRAVEL_SEA = 'travel-sea',
  BIOENERGY = 'bioenergy',
  WATER_CONSUMPTION = 'water_supply',
  ELECTRICITY_CONSUMPTION = 'energy_consumption',
  FUELS = 'fuels',
  HOTEL_STAY = 'hotel_stay',
}

export type BusTripEntry = {
  type: CalculationType.TRAVEL_LAND;
  specification: 'local_bus' | 'coach' | 'average_local_bus' | 'average';
  return_trip: boolean;
  passengers: number;
  value: number | string;
  unit: 'kilometers';
};

export interface StepBusTripProps {
  formData: BusTripEntry;
  setFormData: React.Dispatch<React.SetStateAction<BusTripEntry>>;
  removeEntry: (type: 'bus-trip', index: number) => void;
  entryIndex: number;
  entryType: 'bus-trip';
}

export type TrainJourneyEntry = {
  type: CalculationType.TRAVEL_LAND;
  activity: 'rail';
  specification: 'national_rail' | 'international_rail' | 'light_rail_and_tram' | 'average';
  value: number | string;
  unit: 'passenger.kilometers';
  distance: number | string;
  passengers: number | string;
  round_trip: boolean;
};

export type ElectricityEntry = {
  type: CalculationType.ELECTRICITY_CONSUMPTION;
  value: number;
  unit?: 'kWh';
};

export type WaterSupplyEntry = {
  type: CalculationType.WATER_CONSUMPTION;
  value: number;
  unit?: 'liters' | 'cubic meters' | 'cubic inches' | 'gallons';
};

export type TravelAirEntry = {
  type: CalculationType.TRAVEL_AIR;
  activity: 'flights';
  specification: 'short-haul' | 'long-haul' | 'average';
  detail: 'economy_class' | 'business_class' | 'average' | 'premium_economy_class' | 'first_class';
  departure: string;
  destination: string;
  return_trip: boolean;
  passengers: number;
};

export type CarJourneyEntry = {
  type: CalculationType.TRAVEL_LAND;
  activity: 'cars_by_market_segment';
  specification:
    | 'mini'
    | 'supermini'
    | 'lower_medium'
    | 'upper_medium'
    | 'executive'
    | 'luxury'
    | 'sports'
    | 'dual_purpose_4x4'
    | 'mpv'
    | 'average';
  detail:
    | 'diesel'
    | 'petrol'
    | 'battery_electric_vehicle'
    | 'plug-in_hybrid_electric_vehicle'
    | 'average';
  return_trip: boolean;
  unit: 'kilometers';
  value: number | string;
};

export type HotelEntry = {
  type: 'hotel_stay';
  activity: HotelCode;
  value: number;
  unit: 'room_per_night';
  rooms?: number;
  overnightStays: number;
};

export interface FuelEntry {
  type: CalculationType.FUELS;
  activity: string;
  specification: string;
  value: number;
  unit: string;
}

export interface MultiStepFormData {
  airTravel: TravelAirEntry[];
  carJourney: CarJourneyEntry[];
  waterSupply: WaterSupplyEntry[];
  electricityConsumption: ElectricityEntry[];
  trainJourney: TrainJourneyEntry[];
  busTrip: BusTripEntry[];
  hotelStay: HotelEntry[];
  fuel: FuelEntry[];
}

export interface CalculationPayload {
  calculation_options: (
    | TravelAirEntry
    | CarJourneyEntry
    | WaterSupplyEntry
    | ElectricityEntry
    | TrainJourneyEntry
    | BusTripEntry
    | HotelEntry
    | FuelEntry
  )[];
  order_count: number;
}

export interface CalculationResultDetail {
  type: string;
  activity: string;
  specification: string;
  detail: string;
  value: number;
  unit: string;
  kgCO2e: number;
  emission_factor_id: number;
  emission_factor_last_updated: string;
}

export interface CalculatorResponse {
  kgCO2e: number;
  calculation_id: string;
  results: CalculationResultDetail[];
}

export interface SavedCalculationResult {
  _id: string;
  calculation_id: string;
  kgCO2e: number;
  results: CalculationResultDetail[];
  createdAt: string;
}
