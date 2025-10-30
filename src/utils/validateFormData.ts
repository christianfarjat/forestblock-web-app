import { MultiStepFormData } from "@/types/calculator";

export const validateFormData = (formData: MultiStepFormData): string[] => {
  const errors: string[] = [];

  // Validación para viajes aéreos: aeropuertos obligatorios.
  const hasEmptyAirports = (formData.airTravel || []).some(
    (entry) => !entry?.departure?.trim() || !entry?.destination?.trim()
  );
  if (hasEmptyAirports) {
    errors.push(
      "Por favor, completa todos los campos de los aeropuertos de salida y destino."
    );
  }

  // Validación para viajes en coche: distancia válida.
  const hasEmptyCarValue = (formData.carJourney || []).some(
    (entry) => !entry?.value || Number(entry.value) <= 0 || entry.value === ""
  );
  if (hasEmptyCarValue) {
    errors.push("Ingresa una distancia válida para el viaje en coche.");
  }

  // Validación para viajes en autobús: distancia válida.
  const hasEmptyBusValue = (formData.busTrip || []).some(
    (entry) => !entry?.value || Number(entry.value) <= 0 || entry.value === ""
  );
  if (hasEmptyBusValue) {
    errors.push("Ingresa una distancia válida para el viaje en autobús.");
  }

  // Validación para viajes en tren: distancia y número de pasajeros.
  const hasTrainValueOrPassengersEmpty = (formData.trainJourney || []).some(
    (entry) =>
      !entry?.value ||
      Number(entry.value) <= 0 ||
      entry.value === "" ||
      !entry?.passengers ||
      Number(entry.passengers) <= 0 ||
      entry.passengers === ""
  );

  if (hasTrainValueOrPassengersEmpty) {
    errors.push(
      "Ingresa una distancia válida y número de pasajeros para el viaje en tren."
    );
  }

  // Validación para estadías en hoteles: noches y habitaciones.
  const hasHotelStayEmpty = (formData.hotelStay || []).some(
    (entry) =>
      !entry?.overnightStays ||
      Number(entry.overnightStays) <= 0 ||
      !entry.rooms ||
      Number(entry.rooms) <= 0
  );

  if (hasHotelStayEmpty) {
    errors.push(
      "Ingresa una cantidad válida de noches para la estadía en el hotel."
    );
  }

  // Validación para consumo de combustible: distancia y consumo medio.
  const hasFuelEmpty = (formData.fuel || []).some(
    (entry) => !entry?.value || Number(entry.value) <= 0
  );

  if (hasFuelEmpty) {
    errors.push("Ingresa números válidos para distancia y consumo medio.");
  }

  const hasElectricityEmpty = (formData.electricityConsumption || []).some(
    (entry) => !entry?.value || Number(entry.value) <= 0
  );

  if (hasElectricityEmpty) {
    errors.push("Ingresa números válidos para el consumo de electricidad.");
  }

  // Validación para suministro de agua.
  const hasWaterSupplyEmpty = (formData.waterSupply || []).some(
    (entry) => !entry?.value || Number(entry.value) <= 0
  );

  if (hasWaterSupplyEmpty) {
    errors.push("Ingresa números válidos para el suministro de agua.");
  }

  return errors;
};
