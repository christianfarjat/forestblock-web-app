/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse {
  consumptions: {
    totalEmissions: number;
    count: number;
    totalCost: number;
    quantity: number;
    tonnes: null | number;
    monthly: Record<string, any>;
    building?: Record<
      string,
      {
        totalEmissions: number;
        count: number;
        totalCost: number;
      }
    >;
  };
  emissions: {
    emissions: {
      total: {
        emissions: number;
        numberOfEmissions: number;
      };
      monthly: Record<string, { emissions: number }>;
      scope: {
        "scope-1": {
          id: string;
          color: string;
          emissions: number;
          numberOfEmissions: number;
          uncertainty: {
            fe: number;
            da: number;
          };
          name: string;
          code: string;
        };
        "scope-2": {
          id: string;
          color: string;
          emissions: number;
          numberOfEmissions: number;
          uncertainty: {
            fe: number;
            da: number;
          };
          name: string;
          code: string;
        };
        "scope-3": {
          id: string;
          color: string;
          emissions: number;
          numberOfEmissions: number;
          uncertainty: {
            fe: number;
            da: number;
          };
          name: string;
          code: string;
        };
      };
      building?: Record<string, number>;
      category?: Record<string, { name: string; emissions: number }>;
    };
  };
}

interface MonthlyEmissionData {
  emissions: number;
  numberOfEmissions?: number;
  uncertainty?: {
    fe: number;
    da: number;
  };
  category?: Record<string, number>;
  company?: Record<string, number>;
  building?: Record<string, number>;
}

export interface DashboardData {
  emissions?: {
    emissions?: {
      category?: Record<string, { name: string; emissions: number }>;
      total?: {
        emissions?: number;
      };
      scope?: Record<string, { name: string; emissions: number }>;
      monthly?: Record<string, MonthlyEmissionData>;
      building?: Record<string, number>;
    };
  };
  consumptions?: {
    count?: number;
    totalEmissions: number;
  };
}

interface DashboardCategory {
  emissions: number;
  name: string;
  color?: string;
}

export interface PieCategoryData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyCategoryRecord {
  month: string;
  [seriesKey: string]: string | number;
}

export interface ScopeData {
  name: string;
  value: number;
}

