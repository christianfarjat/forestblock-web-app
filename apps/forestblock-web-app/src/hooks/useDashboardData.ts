import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardData } from "@/app/dashboard/types";

export const useDashboardData = (
  companyId: string | undefined,
  startDate: string,
  endDate: string
) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}manglai/summary/${companyId}?startDate=${startDate}&endDate=${endDate}`
        );
        setData(response.data);
      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        setError("Error cargando los datos de la empresa.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate]);

  return { data, error, isLoading };
};
