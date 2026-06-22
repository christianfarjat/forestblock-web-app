'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
import TopBar from '@/components/TopBar/TopBar';
import UserAlerts from '@/components/UserAlerts/UserAlerts';
import DashboardSummary from '@/components/DashboardSummary/DashboardSummary';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import Evolution from '@/components/Evolution/Evolution';
import DashboardTabs from '@/components/DashboardTabs/DashboardTabs';
import ScopeTab from '@/components/ScopeTab/ScopeTab';
import TabContent from '@/components/DashboardTabs/TabContent';

import { useDashboardData } from '@/hooks/useDashboardData';
import { useBuildings } from '@/hooks/useBuildings';
import useCategories from '@/hooks/useCategories';
import useEmployees from '@/hooks/useEmployees';
import { useScopeData } from '@/hooks/useScopeData';
import { useDashboardTransformations } from '@/hooks/useDashboardTransformations';
import useDashboardConfig from '@/hooks/useDashboardConfig';

import { TabType } from '@/components/DashboardTabs/types';
import DataError from '@/components/DataError/DataError';
import { CHART_COLORS } from '@/constants';
import { usePersistedYear } from '@/hooks/usePersistedYear';
import { useKlimapiResults } from '@/hooks/useKlimapiResults';
import KlimapiResults from '@/components/KlimapiResults/KlimapiResults';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  const { results } = useKlimapiResults();

  const { availableYears, selectedYear, handleYearChange, startDate, endDate } =
    usePersistedYear(10);

  const [activeTab, setActiveTab] = React.useState<TabType>('alcance');

  const { categories: dynamicCategories, error: catError } = useCategories();
  const {
    data: buildings,
    error: buildingError,
    isLoading: buildingsLoading,
  } = useBuildings(user?.manglaiCompanyId);
  const { employees } = useEmployees(user?.manglaiCompanyId);

  const {
    data,
    error,
    isLoading: dataLoading,
  } = useDashboardData(user?.manglaiCompanyId, startDate, endDate);

  const monthlyRawData = data?.emissions?.emissions?.monthly ?? {};
  const dashboardCategories = data?.emissions?.emissions?.category ?? {};
  const scopes = data?.emissions?.emissions?.scope ?? {};

  const totalEmissions: number = data?.emissions?.emissions?.total?.emissions || 0;
  const count: number = employees?.length || 0;

  const scopeData = useScopeData({
    monthlyRawData,
    dashboardCategories,
    scopes,
    selectedYear,
  });

  const transformations = useDashboardTransformations({
    monthlyRawData,
    dashboardCategories,
    scopes,
    dynamicCategories,
    buildings,
    selectedYear,
    scopeData,
  });

  const { dataForTab, extraPropsForTab, currentScopeChartData } = useDashboardConfig(
    activeTab,
    transformations
  );

  if (isLoading || !user || dataLoading || buildingsLoading) {
    return <LoaderScreenDynamic />;
  }

  if (error) return <DataError message={error} />;
  if (catError) return <DataError message={catError} />;
  if (buildingError) return <DataError message={buildingError} />;

  return (
    <div className="min-h-screen p-3">
      <TopBar />
      <UserAlerts />
      {user?.manglaiCompanyId && (
        <div className="flex-1 p-5 md:p-10 bg-backgroundGray rounded-xl">
          <DashboardHeader
            title="Resumen"
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />

          <DashboardSummary
            totalEmissions={totalEmissions}
            count={count}
            totalConsumptions={data?.consumptions?.totalEmissions}
          />

          <Evolution yearComparisonData={scopeData.yearComparisonData} />

          <h2 className="font-aeonik font-medium text-[15px] md:text-[23px] text-forestGreen mb-5">
            Emisiones por {activeTab}
          </h2>
          <DashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentScopeChartData={currentScopeChartData}
            hasScopeChartData={transformations.hasMonthlyDataAlcance}
            monthlyDataAlcance={transformations.monthlyDataAlcance}
            monthlyChartComponent={
              <TabContent activeTab={activeTab} data={dataForTab} extraProps={extraPropsForTab} />
            }
            COLORS={CHART_COLORS[activeTab]}
            hasMonthlyData={transformations.hasMonthlyDataAlcance}
          />

          <ScopeTab
            scopes={scopes}
            dashboardCategories={dashboardCategories}
            totalEmissions={totalEmissions}
          />
          <h2 className="font-aeonik font-medium text-[15px] md:text-[23px] text-forestGreen mb-5">
            Toneladas de CO₂e a compensar
          </h2>
          <KlimapiResults results={results} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
