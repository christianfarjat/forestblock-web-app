import React from "react";
import Scopes from "../Scopes/Scopes";
import { DashboardCategory } from "@/app/dashboard/types";

export interface ScopeInfo {
  name: string;
  emissions: number;
}

interface ScopeTabProps {
  scopes: Record<string, ScopeInfo>;
  dashboardCategories: Record<string, DashboardCategory>;
  totalEmissions: number;
}

const ScopeTab: React.FC<ScopeTabProps> = ({
  scopes,
  dashboardCategories,
  totalEmissions,
}) => {
  return (
    <div className="my-10">
      <Scopes
        scopes={scopes}
        categories={dashboardCategories}
        totalEmissions={totalEmissions}
      />
    </div>
  );
};

export default ScopeTab;
