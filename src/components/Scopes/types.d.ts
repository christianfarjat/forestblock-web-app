interface ScopeItem {
  name: string;
  code?: string;
  emissions: number;
}

interface CategoryItem {
  name: string;
  code?: string;
  emissions: number;
  parents?: {
    scope?: string;
  };
}

export interface ScopeBreakdownProps {
  scopes: { [key: string]: ScopeItem };
  categories: { [key: string]: CategoryItem };
  totalEmissions: number;
}
