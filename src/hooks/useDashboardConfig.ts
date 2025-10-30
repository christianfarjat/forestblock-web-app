import { TabType } from "@/components/DashboardTabs/types";
import { CHART_COLORS } from "@/constants";
import { TransformationsReturn } from "@/types/useDashboardTransformations";

const getSeriesColors = (
  seriesKeys: string[],
  colorsArray: string[]
): Record<string, string> =>
  seriesKeys.reduce((acc, key, idx) => {
    acc[key] = colorsArray[idx % colorsArray.length];
    return acc;
  }, {} as Record<string, string>);

const useDashboardConfig = (
  activeTab: TabType,
  transformations: TransformationsReturn
) => {
  let dataForTab: any; //eslint-disable-line
  let extraPropsForTab: any = {}; //eslint-disable-line

  switch (activeTab) {
    case "alcance":
      dataForTab = transformations.monthlyDataAlcance;
      extraPropsForTab = { colors: CHART_COLORS.alcance };
      break;
    case "categorias":
      dataForTab = transformations.monthlyDataCategoriasTransformed;
      extraPropsForTab = {
        colors: getSeriesColors(
          transformations.seriesKeys,
          CHART_COLORS.categorias
        ),
        seriesKeys: transformations.seriesKeys,
      };
      break;
    case "edificios":
      dataForTab = transformations.monthlyDataBuildings;
      extraPropsForTab = {
        colors: getSeriesColors(
          transformations.seriesKeysBuildings,
          CHART_COLORS.edificios
        ),
        seriesKeys: transformations.seriesKeysBuildings,
      };
      break;
    default:
      dataForTab = null;
  }

  const scopeChartMapping = {
    alcance: transformations.scopeChartDataAlcance,
    categorias: transformations.topCategoryDataForPie,
    edificios: transformations.buildingChartData,
  };

  return {
    dataForTab,
    extraPropsForTab,
    currentScopeChartData: scopeChartMapping[activeTab],
  };
};

export default useDashboardConfig;
