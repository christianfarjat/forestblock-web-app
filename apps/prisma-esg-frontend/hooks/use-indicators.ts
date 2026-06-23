'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useIndicatorsStore } from '@/lib/indicators-store';

export function useIndicators() {
  const {
    indicators,
    selectedPillar,
    isLoading,
    error,
    setIndicators,
    setSelectedPillar,
    setLoading,
    setError,
    addIndicator,
    updateIndicator,
    removeIndicator,
  } = useIndicatorsStore();

  const loadIndicators = async () => {
    setLoading(true);
    try {
      const data = await apiClient.listIndicators(selectedPillar || undefined);
      setIndicators(data);
      setError(null);
    } catch (err: unknown) {
      setError('Failed to load indicators');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndicators();
  }, [selectedPillar]);

  const createIndicator = async (indicator: {
    pillar: string;
    code: string;
    name: string;
    unit?: string;
    value?: number;
    period?: string;
    status?: string;
    completeness?: number;
  }) => {
    try {
      const created = await apiClient.createIndicator(indicator);
      addIndicator(created);
      setError(null);
      return created;
    } catch (err) {
      setError('Failed to create indicator');
      console.error(err);
      throw err;
    }
  };

  const updateIndicatorData = async (
    id: string,
    updates: Partial<typeof indicators[0]>
  ) => {
    try {
      const updated = await apiClient.updateIndicator(id, updates as Record<string, unknown>);
      updateIndicator(id, updated);
      setError(null);
      return updated;
    } catch (err: unknown) {
      setError('Failed to update indicator');
      console.error(err);
      throw err;
    }
  };

  const deleteIndicator = async (id: string) => {
    try {
      await apiClient.deleteIndicator(id);
      removeIndicator(id);
      setError(null);
    } catch (err) {
      setError('Failed to delete indicator');
      console.error(err);
      throw err;
    }
  };

  return {
    indicators,
    selectedPillar,
    isLoading,
    error,
    setSelectedPillar,
    createIndicator,
    updateIndicator: updateIndicatorData,
    deleteIndicator,
    reload: loadIndicators,
  };
}
