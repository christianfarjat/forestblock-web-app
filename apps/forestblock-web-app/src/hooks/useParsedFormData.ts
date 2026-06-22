import { useMemo } from "react";
import {
  CalculationType,
  TravelAirEntry,
  CarJourneyEntry,
  MultiStepFormData,
  WaterSupplyEntry,
  ElectricityEntry,
  TrainJourneyEntry,
  BusTripEntry,
  HotelEntry,
  FuelEntry,
} from "@/types/calculator";
import { HotelCode } from "@/constants";

const useParsedFormData = (formData: MultiStepFormData) => {
  const validAirTravelData = useMemo<TravelAirEntry[]>(() => {
    return (formData.airTravel ?? [])
      .filter(
        (e) =>
          (e.departure ?? "").trim().length > 0 &&
          (e.destination ?? "").trim().length > 0
      )
      .map((entry) => ({
        type: CalculationType.TRAVEL_AIR,
        activity: "flights",
        specification:
          ((entry.specification ?? "").trim() as
            | "short-haul"
            | "long-haul"
            | "average") || "average",
        detail:
          ((entry.detail ?? "").trim() as
            | "economy_class"
            | "business_class"
            | "premium_economy_class"
            | "first_class"
            | "average") || "average",
        departure: (entry.departure ?? "").trim(),
        destination: (entry.destination ?? "").trim(),
        return_trip: entry.return_trip ?? true,
        passengers: entry.passengers ?? 1,
      }));
  }, [formData.airTravel]);

  const validCarJourneyData = useMemo<CarJourneyEntry[]>(() => {
    const raw = formData.carJourney ?? [];

    const withParsed = raw.map((e) => {
      const parsed = Number(e.value);
      return { ...e, _valueNum: parsed } as typeof e & { _valueNum: number };
    });

    const filtered = withParsed.filter(
      (e) => !isNaN(e._valueNum) && e._valueNum > 0
    );

    const mapped: CarJourneyEntry[] = filtered.map((entry) => {
      const out: CarJourneyEntry = {
        type: CalculationType.TRAVEL_LAND,
        activity: "cars_by_market_segment",
        specification:
          ((
            entry.specification ?? ""
          ).trim() as CarJourneyEntry["specification"]) || "average",
        detail:
          ((entry.detail ?? "").trim() as CarJourneyEntry["detail"]) ||
          "average",
        return_trip: entry.return_trip ?? true,
        unit: (entry.unit ?? "kilometers") as CarJourneyEntry["unit"],
        value: entry._valueNum,
      };
      return out;
    });

    return mapped;
  }, [formData.carJourney]);

  const validWaterSupplyData = useMemo<WaterSupplyEntry[]>(() => {
    return (formData.waterSupply ?? [])
      .filter((e) => typeof e.value === "number" && e.value > 0)
      .map((entry) => ({
        type: CalculationType.WATER_CONSUMPTION,
        value: entry.value ?? 0,
        unit: (entry.unit ?? "cubic meters") as
          | "liters"
          | "cubic meters"
          | "cubic inches"
          | "gallons",
      }));
  }, [formData.waterSupply]);

  const validElectricityConsumptionData = useMemo<ElectricityEntry[]>(() => {
    const raw = formData.electricityConsumption ?? [];

    const withParsed = raw.map((e) => {
      const parsed = Number(e.value);
      return { ...e, _valueNum: parsed } as typeof e & { _valueNum: number };
    });

    const filtered = withParsed.filter(
      (e) => !isNaN(e._valueNum) && e._valueNum > 0
    );

    const mapped: ElectricityEntry[] = filtered.map((entry) => {
      const out: ElectricityEntry = {
        type: CalculationType.ELECTRICITY_CONSUMPTION,
        value: entry._valueNum,
        unit: entry.unit ?? "kWh",
      };
      return out;
    });

    return mapped;
  }, [formData.electricityConsumption]);

  const validTrainJourneyData = useMemo<TrainJourneyEntry[]>(() => {
    const allowedSpecs = [
      "national_rail",
      "international_rail",
      "light_rail_and_tram",
      "average",
    ] as const;

    return (formData.trainJourney ?? [])
      .filter(
        (e) =>
          (typeof e.distance === "number" && e.distance > 0) ||
          (typeof e.value === "number" && e.value > 0)
      )
      .map((entry) => {
        const rawSpec = (entry.specification ?? "").trim();
        const spec = allowedSpecs.includes(
          rawSpec as (typeof allowedSpecs)[number]
        )
          ? (rawSpec as (typeof allowedSpecs)[number])
          : "average";

        return {
          type: CalculationType.TRAVEL_LAND,
          activity: "rail",
          specification: spec,
          value: entry.value ?? 0,
          unit: (entry.unit ?? "passenger.kilometers") as
            | "passenger.kilometers",
          distance: entry.distance ?? 0,
          passengers: entry.passengers ?? 1,
          round_trip: entry.round_trip ?? true,
        };
      });
  }, [formData.trainJourney]);

  const validBusTripData = useMemo<BusTripEntry[]>(() => {
    return (formData.busTrip ?? [])
      .filter((e) => typeof e.value === "number" && e.value > 0)
      .map((entry) => ({
        type: CalculationType.TRAVEL_LAND,
        activity: "bus",
        specification:
          ((entry.specification ?? "").trim() as
            | "local_bus"
            | "average_local_bus"
            | "coach"
            | "average") || "average",
        return_trip: entry.return_trip ?? true,
        passengers: entry.passengers ?? 1,
        value: entry.value ?? 0,
        unit: (entry.unit ?? "kilometers") as "kilometers",
      }));
  }, [formData.busTrip]);

  const validHotelStayData = useMemo<HotelEntry[]>(() => {
    return (formData.hotelStay ?? [])
      .filter(
        (e) =>
          typeof e.rooms === "number" &&
          e.rooms > 0 &&
          typeof e.overnightStays === "number" &&
          e.overnightStays > 0
      )
      .map((entry) => ({
        type: "hotel_stay",
        activity: ((entry.activity ?? "").trim() as HotelCode) || "average",
        value: (entry.overnightStays ?? 0) * (entry.rooms ?? 0),
        unit: "room_per_night",
        overnightStays: entry.overnightStays ?? 0,
      }));
  }, [formData.hotelStay]);

  const validFuelData = useMemo<FuelEntry[]>(() => {
    return (formData.fuel ?? [])
      .filter((e) => typeof e.value === "number" && e.value > 0)
      .map((entry) => ({
        type: CalculationType.FUELS,
        activity: "liquid_fuels",
        specification: (entry.specification ?? "").trim() || "average",
        value: entry.value ?? 0,
        unit: (entry.unit ?? "liters") as string,
      }));
  }, [formData.fuel]);

  const allEntries = useMemo(
    () => [
      ...validAirTravelData,
      ...validCarJourneyData,
      ...validWaterSupplyData,
      ...validElectricityConsumptionData,
      ...validTrainJourneyData,
      ...validBusTripData,
      ...validHotelStayData,
      ...validFuelData,
    ],
    [
      validAirTravelData,
      validCarJourneyData,
      validWaterSupplyData,
      validElectricityConsumptionData,
      validTrainJourneyData,
      validBusTripData,
      validHotelStayData,
      validFuelData,
    ]
  );

  return {
    validAirTravelData,
    validCarJourneyData,
    validWaterSupplyData,
    validElectricityConsumptionData,
    validTrainJourneyData,
    validBusTripData,
    validHotelStayData,
    validFuelData,
    allEntries,
  };
};

export default useParsedFormData;
