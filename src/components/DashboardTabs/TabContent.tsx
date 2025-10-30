import React from "react";
import { tabConfig } from "@/utils/dashboardTabs.config";
import { TabType } from "@/components/DashboardTabs/types";

interface TabContentProps {
  activeTab: TabType;
  data: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  extraProps: any; //eslint-disable-line @typescript-eslint/no-explicit-any
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  data,
  extraProps,
}) => {
  // Se obtiene la configuración basada en el tab activo
  const currentTabConfig = tabConfig[activeTab];

  if (!currentTabConfig) {
    return null;
  }

  // Se extrae el ChartComponent configurado
  const ChartComponent = currentTabConfig.ChartComponent;
  return <ChartComponent data={data} {...extraProps} />;
};

export default TabContent;
