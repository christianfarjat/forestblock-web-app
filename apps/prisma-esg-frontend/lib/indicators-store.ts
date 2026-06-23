import { create } from 'zustand';
import { Indicator, Pillar } from '@/types';

interface IndicatorsState {
  indicators: Indicator[];
  selectedPillar: Pillar | null;
  isLoading: boolean;
  error: string | null;

  setIndicators: (indicators: Indicator[]) => void;
  setSelectedPillar: (pillar: Pillar | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addIndicator: (indicator: Indicator) => void;
  updateIndicator: (id: string, updates: Partial<Indicator>) => void;
  removeIndicator: (id: string) => void;
}

export const useIndicatorsStore = create<IndicatorsState>((set) => ({
  indicators: [],
  selectedPillar: null,
  isLoading: false,
  error: null,

  setIndicators: (indicators) => set({ indicators }),
  setSelectedPillar: (selectedPillar) => set({ selectedPillar }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addIndicator: (indicator) =>
    set((state) => ({
      indicators: [...state.indicators, indicator],
    })),

  updateIndicator: (id, updates) =>
    set((state) => ({
      indicators: state.indicators.map((ind) =>
        ind.id === id ? { ...ind, ...updates } : ind
      ),
    })),

  removeIndicator: (id) =>
    set((state) => ({
      indicators: state.indicators.filter((ind) => ind.id !== id),
    })),
}));
