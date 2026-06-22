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

export interface FuelType {
  authorship: Authorship;
  id: string;
  types: string[];
  name: string;
  legalName: string;
  order: number;
  code: string;
  units: unknown[];
  countries: string[];
  excludedCountries: unknown[];
  classifications: string[];
}

export interface VehicleCategory {
  id: string;
  category: string;
  name: string;
  code: string;
  colorScheme: string;
  legalName: string;
  unitTypes: string[];
  categoryId: string;
}

export interface Vehicle {
  authorship: Authorship;
  id: string;
  type: string;
  vehicleCategoryId: string;
  motorType: string;
  fuelTypeId?: string;
  fuelType?: FuelType;
  companyId: string;
  buildingId: string;
  licencePlate: string;
  brand?: string;
  class?: string | null;
  transportType: string;
  model?: string;
  control?: string | null;
  operationalControl?: string | null;
  startDate: string | null;
  endDate: string | null;
  isGeneric: boolean;
  vehicleCategory: VehicleCategory;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface VehicleDashboardSummary {
  category: Record<
    string,
    {
      totalEmissions: number;
      count: number;
    }
  >;
  company: Record<
    string,
    {
      totalEmissions: number;
      count: number;
    }
  >;
  building: Record<
    string,
    {
      totalEmissions: number;
      count: number;
    }
  >;
  entity: Record<
    string,
    {
      totalEmissions: number;
      count: number;
    }
  >;
  fuelType: Record<
    string,
    {
      totalEmissions: number;
      count: number;
    }
  >;
  vehicleCategory: Record<
    string,
    {
      totalEmissions: number;
      count: number;
      byCompany?: Record<
        string,
        {
          totalEmissions: number;
          count: number;
          byFuelType?: Record<
            string,
            {
              totalEmissions: number;
              count: number;
              byUnit?: Record<
                string,
                {
                  totalEmissions: number;
                  quantity: number;
                  count: number;
                }
              >;
            }
          >;
        }
      >;
      byFuelType?: Record<
        string,
        {
          totalEmissions: number;
          count: number;
          byUnit?: Record<
            string,
            {
              totalEmissions: number;
              quantity: number;
              count: number;
            }
          >;
        }
      >;
    }
  >;
  brand: Record<
    string,
    {
      totalEmissions: number;
      count: number;
    }
  >;
  monthly: Record<
    string,
    {
      totalEmissions: number;
      count: number;
      vehicleCategory: Record<
        string,
        {
          totalEmissions: number;
          count: number;
          byCompany?: Record<
            string,
            {
              totalEmissions: number;
              count: number;
              byFuelType?: Record<
                string,
                {
                  totalEmissions: number;
                  count: number;
                  byUnit?: Record<
                    string,
                    {
                      totalEmissions: number;
                      quantity: number;
                      count: number;
                    }
                  >;
                }
              >;
            }
          >;
          byFuelType?: Record<
            string,
            {
              totalEmissions: number;
              count: number;
              byUnit?: Record<
                string,
                {
                  totalEmissions: number;
                  quantity: number;
                  count: number;
                }
              >;
            }
          >;
        }
      >;
      brand: Record<
        string,
        {
          totalEmissions: number;
          count: number;
        }
      >;
      vehicle: Record<
        string,
        {
          totalEmissions: number;
          count: number;
          companyId: string;
        }
      >;
    }
  >;
  totalEmissions: number;
  count: number;
}

export interface VehiclesResponse {
  vehicles: {
    data: Vehicle[];
    pagination: Pagination;
  };
  dashboard: VehicleDashboardSummary;
}
