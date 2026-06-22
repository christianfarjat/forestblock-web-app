import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios/axiosInstance";
import { useBuildings } from "@/hooks/useBuildings";
import { Building } from "@/types/buildings";
import { EmissionsDashboard } from "@/types/emissions";

export function useBuildingsEmissions(
  companyId?: string,
  startDate?: string,
  endDate?: string
) {
  const {
    data: buildings,
    error: buildingsError,
    isLoading: buildingsLoading,
  } = useBuildings(companyId);

  const [emissions, setEmissions] = useState<EmissionsDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId || buildingsLoading) return;

    if (buildings.length === 0) {
      setLoading(false);
      return;
    }

    const buildingIds = buildings.map((b: Building) => b.id).join(",");
    setLoading(true);
    axiosInstance
      .get(
        `manglai/emissions/${companyId}?buildingIds=${buildingIds}&startDate=${startDate}&endDate=${endDate}`
      )

      .then((response) => {
        setEmissions(response.data);
        console.log("Emissions data:", response.data);
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error fetching buildings emissions dashboard";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [companyId, buildings, buildingsLoading, startDate, endDate]);

  return {
    buildings,
    emissions,
    loading: buildingsLoading || loading,
    error: buildingsError || error,
  };
}
