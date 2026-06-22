import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios/axiosInstance";
import { Building } from "@/types/buildings";

export function useBuildings(
  companyId?: string,
  startDate?: string,
  endDate?: string
) {
  const [data, setData] = useState<Building[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!companyId) return;
    setIsLoading(true);
    axiosInstance
      .get(
        `/manglai/buildings/${companyId}?startDate=${startDate}&endDate=${endDate}`
      )
      .then((response) => {
        setData(response.data?.data || []);
      })
      .catch((err) => {
        setError(err.message || "Error fetching buildings");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [companyId, startDate, endDate]);

  return { data, error, isLoading };
}
