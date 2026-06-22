import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios/axiosInstance";
import { ConsumptionsResponse, Consumption } from "@/types/consumptions";

const useConsumptions = (
  companyId?: string,
  startDate?: string,
  endDate?: string
) => {
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const fetchConsumptions = async () => {
      try {
        const response = await axiosInstance.get<ConsumptionsResponse>(
          `/manglai/consumptions/${companyId}?startDate=${startDate}&endDate=${endDate}`
        );
        setConsumptions(response.data.data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Ocurrió un error al cargar los consumos";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchConsumptions();
  }, [companyId, startDate, endDate]);

  return { consumptions, loading, error };
};

export default useConsumptions;
