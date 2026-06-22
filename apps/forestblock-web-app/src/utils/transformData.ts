/* eslint-disable @typescript-eslint/no-explicit-any */

export const transformScopeData = (
  scopes: Record<string, any>,
  colors: string[]
) =>
  Object.entries(scopes).map(([, val]: [string, any], index: number) => ({
    name: val.name,
    value: val.emissions,
    color: colors[index % colors.length],
  }));

export const transformCategoryData = (categories: Record<string, any>) =>
  Object.entries(categories).map(([, val]: [string, any]) => ({
    name: val.name,
    emissions: val.emissions,
  }));

export function transformYearComparisonData(
  monthlyRawData: Record<string, any>,
  currentYear: number,
  previousYear: number
) {
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const dataForChart: Array<{
    month: string;
    currentYear: number;
    previousYear: number;
  }> = [];

  for (let m = 1; m <= 12; m++) {
    const currentKey = `${m}/${currentYear}`;
    const previousKey = `${m}/${previousYear}`;

    const currentEmissions = monthlyRawData[currentKey]?.emissions ?? 0;
    const previousEmissions = monthlyRawData[previousKey]?.emissions ?? 0;

    dataForChart.push({
      month: monthNames[m - 1],
      currentYear: currentEmissions,
      previousYear: previousEmissions,
    });
  }

  return dataForChart;
}

export function transformMonthlyDataByScope(
  monthlyRawData: Record<string, any>,
  categoryMapping: Record<string, any>,
  year: number
) {
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const result: Array<{
    month: string;
    scope1: number;
    scope2: number;
    scope3: number;
  }> = [];

  for (let m = 1; m <= 12; m++) {
    const key = `${m}/${year}`;
    const monthData = monthlyRawData[key];
    const monthName = monthNames[m - 1];

    let scope1 = 0;
    let scope2 = 0;
    let scope3 = 0;

    if (monthData && monthData.category) {
      for (const [catKey, catEmission] of Object.entries(monthData.category)) {
        const catInfo = categoryMapping[catKey];
        if (catInfo && catInfo.parents && catInfo.parents.scope) {
          const scope = catInfo.parents.scope;
          const emissionValue = Number(catEmission);
          if (scope === "scope-1") {
            scope1 += emissionValue;
          } else if (scope === "scope-2") {
            scope2 += emissionValue;
          } else if (scope === "scope-3") {
            scope3 += emissionValue;
          }
        }
      }
    }

    result.push({ month: monthName, scope1, scope2, scope3 });
  }

  return result;
}
