export interface Authorship {
  apiInfo?: unknown | null;
  lastImpersonatedBy: unknown | null;
  lastModifiedBy: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    isLoggedIn: boolean;
    language: string | null;
    company: Record<string, unknown>;
  } | null;
  owner: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    isLoggedIn: boolean;
    language: string | null;
    company: Record<string, unknown>;
  } | null;
  source?: string | null;
  createdAt: string;
  updatedAt: string;
  validation: Record<string, unknown>;
}

export interface ExtraDataConsumption {
  unit?: string;
  quantity?: number;
  categoryId?: string;
  emissions?: number;
  gdo?: string;
  fuel?: string;
  fuelType?: string | null;
  type?: string;
  transactionId?: string;
  lines?: {
    concept: string;
    description: string;
    netAmount: number | null;
    quantity: number | null;
    unit: string | null;
  }[];
  productStatus?: string;
  categoryCode?: string;
  exchangeRate?: number;
  actions?: {
    id: string;
    distance: number;
    from: string;
    to: string;
    vehicleType: string;
    loadPercentage?: string | null;
    unit: string;
    tonnes: number;
    fuelType?: string | null;
    transportType?: string;
    category?: string;
  }[];
  from?: string;
  to?: string;
  distance?: number;
  tonnes?: number;
}

export interface Uncertainty {
  fePercentage: number;
  daPercentage: number;
  percentage: number;
  quantity: number;
  category: string;
}

export interface EmissionFactorSnapshot {
  _id?: string;
  id: string;
  __v?: number;
  conversion?: unknown | null;
  countryCode: string;
  createdAt: string;
  description?: string | null;
  emissionFactor: number;
  entity: Record<string, unknown>;
  entityName: string;
  origin: string;
  source: string;
  unit: string;
  unitType: string;
  updatedAt: string;
  year?: number;
  complementaryEmissionFactors?: {
    code: string;
    emissionFactor: number;
    emission: number;
  }[];
}

export interface Emission {
  id: string;
  biogenic: {
    emission: number;
    emissionFactorSnapshot: {
      source: string;
      id: string;
    };
  } | null;
  calculatedFromCategoryId: string | null;
  categoryId: string;
  emission: number;
  emissionFactorSnapshot: EmissionFactorSnapshot;
  endDate: string;
  entityId: string;
  startDate: string;
  uncertainty: Uncertainty;
  partialEmissions?: {
    emissionFactorSnapshot: EmissionFactorSnapshot;
    emission: number;
    categoryId: string;
    uncertainty: Uncertainty;
  }[];
}

export interface Consumption {
  authorship: Authorship;
  id: string;
  companyId: string;
  buildingId: string;
  entityId: string;
  categoryId: string;
  emissionsCategoryIds: string[];
  startDate: string;
  endDate: string;
  quantity: number | string;
  unitType: string;
  extraData: ExtraDataConsumption;
  emission: Emission;
  countryCode: string;
  totalCost: number;
  currency: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface ConsumptionsResponse {
  data: Consumption[];
  pagination: Pagination;
}

export interface ConsumptionDashboardSummary {
  totalEmissions: number;
  totalCost: number;
  consumptionCategory: {
    [categoryId: string]: {
      totalEmissions: number;
      totalCost: number;
      count: number;
    };
  };
  monthly: {
    [yyyymm: string]: {
      consumptionCategory: {
        [categoryId: string]: {
          totalEmissions: number;
          totalCost: number;
          count: number;
        };
      };
    };
  };
}
