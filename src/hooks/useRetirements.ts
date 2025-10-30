import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Retirement } from "@/types/useRetirements";
import axiosInstance from "@/utils/axios/axiosInstance";

const useRetirements = () => {
  const [retirements, setRetirements] = useState<Retirement[]>([]);
  const [retirement, setRetirement] = useState<Retirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retirementId, setRetirementId] = useState<string | null>(null);
  const { user } = useAuth();

  const walletAddress = user?.walletAddress;

  const fetchRetirements = useCallback(async () => {
    setLoading(true);
    try {
      const response: AxiosResponse = await axiosInstance.get(`retirements`, {
        params: { walletAddress },
      });

      setRetirements(response.data.local);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Error status:", err.response.status);
        console.error("Error details:", err.response.data);
      } else {
        console.error("Error fetching retirements:", (err as Error).message);
      }
      setError("Error al obtener los retiros de carbono.");
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  const fetchRetirementDetail = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response: AxiosResponse = await axiosInstance.get(
          `retirements/${id}/${walletAddress}`
        );
        setRetirement(response.data.retirement);
        setRetirementId(response.data.retirementId);
      } catch (err: unknown) {
        setError("Error al obtener detalles del retiro.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [walletAddress]
  );

  const fetchRetirementByPaymentId = (paymentId: string) => {
    try {
      const retirement = axiosInstance.get(
        `retirements/byPaymentId/${paymentId}`
      );
      return retirement;
    } catch (err: unknown) {
      setError("Error al obtener detalles del retiro.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRetirements();
  }, [fetchRetirements]);

  return {
    fetchRetirements,
    retirements,
    fetchRetirementDetail,
    retirement,
    loading,
    error,
    retirementId,
    fetchRetirementByPaymentId,
  };
};

export default useRetirements;
