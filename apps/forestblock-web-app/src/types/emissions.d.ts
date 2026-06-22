export interface Uncertainty {
  da: number;
  fe: number;
}

export interface EmissionSummary {
  emissions: number;
  numberOfEmissions: number;
}

export interface MonthlyEmissionsData {
  emissions: number;
  numberOfEmissions: number;
  uncertainty: Uncertainty;
  category: Record<string, number>;
  company: Record<string, number>;
  building: Record<string, number>;
  categoryByBuilding: Record<string, Record<string, number>>;
  categoryByCompany: Record<string, Record<string, number>>;
}

export interface EmissionsSection {
  total: EmissionSummary;
  monthly: Record<string, MonthlyEmissionsData>;
}

export interface ScopeItem {
  id: string;
  color?: string;
  emissionSources: Array<string | null>;
  emissions: number;
  numberOfEmissions: number;
  uncertainty: Uncertainty;
  name: string;
  code: string;
  parents?: { scope: string };
}

export interface CategoryItem {
  id: string;
  color?: string;
  emissionSources: Array<string | null>;
  emissions: number;
  numberOfEmissions: number;
  uncertainty: Uncertainty;
  name: string;
  code: string;
  parents: { scope: string };
}

export interface SubcategoryItem {
  id: string;
  color?: string;
  emissionSources: Array<string | null>;
  emissions: number;
  numberOfEmissions: number;
  uncertainty: Uncertainty;
  name: string;
  code: string;
  parents: { scope: string; category: string };
}

export interface EmissionRecord {
  _id: string;
  id: string;
  emission: number;
  buildingId: string | null;
  categoryId: string;
  companyId: string;
  startDate: string;
  endDate: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface EmissionsDashboard {
  data: EmissionRecord[];
  pagination: Pagination;
}
