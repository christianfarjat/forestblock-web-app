import { ScopeData } from "@/app/dashboard/types";

export type TabType = "alcance" | "categorias" | "edificios";

export type MonthlyDataAlcance = {
  month: string;
  scope1: number;
  scope2: number;
  scope3: number;
};

export interface DashboardTabsProps {
  children?: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentScopeChartData: ScopeData[];
  hasScopeChartData: boolean;
  monthlyDataAlcance: MonthlyDataAlcance[];
  COLORS: string[];
  hasMonthlyData: boolean;
  monthlyChartComponent: JSX.Element;
}

export interface TabButtonProps {
  label: string;
  tabValue: TabType;
  activeTab: TabType;
  onClick: (value: TabType) => void;
}
