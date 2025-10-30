export interface AuthorshipUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isLoggedIn: boolean;
  language: string | null;
  company: Record<string, unknown>;
}

export interface Authorship {
  apiInfo?: unknown | null;
  lastImpersonatedBy: unknown | null;
  lastModifiedBy: AuthorshipUser | null;
  owner: AuthorshipUser | null;
  source?: string | null;
  createdAt: string;
  updatedAt: string;
  validation: Record<string, unknown>;
}

export interface StructuredAddress {
  country: string;
  region: string;
  province: string;
  city: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  lat: string;
  lng: string;
}

export interface Building {
  id: string;
  __v: number;
  address: string;
  authorship: Authorship;
  combustionCUPs: unknown[];
  electricityCUPs: unknown[];
  renewableEnergyTypes: unknown[];
  waterCUPs?: unknown[];
  categoriesWithControl?: unknown[];
  companyId: string;
  control: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  endDate: string | null;
  startDate: string | null;
  isActive: boolean;
  m2: string;
  name: string;
  operationalControl: string;
  type: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface BuildingsResponse {
  data: Building[];
  pagination: Pagination;
}
