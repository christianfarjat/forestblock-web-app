/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios/axiosInstance';
import { CalculationPayload, CalculatorResponse, MultiStepFormData } from '@/types/calculator';
import { validateFormData } from '@/utils/validateFormData';

const useCalculator = () => {
  const [calculatorResponse, setCalculatorResponse] = useState<CalculatorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalKgCO2e, setTotalKgCO2e] = useState<number>(0);

  const [formData, setFormData] = useState<MultiStepFormData>({
    airTravel: [],
    carJourney: [],
    waterSupply: [],
    electricityConsumption: [],
    trainJourney: [],
    busTrip: [],
    hotelStay: [],
    fuel: [],
  });

  const addEntry = (type: keyof MultiStepFormData, defaultEntry: any) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), defaultEntry],
    }));
  };

  const calculate = useCallback(
    async (payload: CalculationPayload): Promise<any> => {
      const errors = validateFormData(formData);
      if (errors.length > 0) {
        errors.forEach((error) => alert(error));
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data }: AxiosResponse<CalculatorResponse> =
          await axiosInstance.post<CalculatorResponse>('klimapi/calculate', payload);
        setTotalKgCO2e((prev) => prev + data.kgCO2e);
        setCalculatorResponse(data);
        return data;
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          console.error('Error status:', err.response.status);
          console.error('Error details:', err.response.data);
        } else if (err instanceof Error) {
          console.error('Error calculating:', err.message);
        }
        setError('Error al calcular la huella de carbono.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  const saveCalculation = useCallback(async (responseToSave: CalculatorResponse) => {
    try {
      await axiosInstance.post('klimapi/calculate/save', responseToSave);
      alert('Resultado guardado correctamente 👍');
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar el resultado.');
    }
  }, []);

  return {
    calculate,
    loading,
    error,
    formData,
    setFormData,
    addEntry,
    totalKgCO2e,
    saveCalculation,
    calculatorResponse,
  };
};

export default useCalculator;
