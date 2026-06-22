"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios/axiosInstance";
import {
  VehiclesResponse,
  Vehicle,
  VehicleDashboardSummary,
} from "@/types/vehicles";

export const useVehicles = (
  companyId: string | undefined,
  startDate: string,
  endDate: string
) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesSummary, setVehiclesSummary] = useState<
    VehicleDashboardSummary | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!companyId) return;

      setLoading(true);
      try {
        const url = `/manglai/vehicles/${companyId}?startDate=${startDate}&endDate=${endDate}`;
        const response = await axiosInstance.get<VehiclesResponse>(url);

        setVehiclesSummary(response.data.dashboard);
        setVehicles(response.data.vehicles.data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Ha ocurrido un error al cargar los vehículos";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [companyId, startDate, endDate]);

  return { vehicles, vehiclesSummary, loading, error };
};
