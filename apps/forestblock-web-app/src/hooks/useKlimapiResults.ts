import { useState, useEffect } from 'react';
import { SavedCalculationResult } from '@/types/calculator';
import axiosInstance from '@/utils/axios/axiosInstance';

export const useKlimapiResults = () => {
  const [results, setResults] = useState<SavedCalculationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`klimapi/calculate/results`);
        setResults(response.data);
      } catch (err: unknown) {
        console.error('Error fetching klimapi results:', err);
        setError('Error cargando los resultados de Klimapi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  return { results, error, isLoading };
};
