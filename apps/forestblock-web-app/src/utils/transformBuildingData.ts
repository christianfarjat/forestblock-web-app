import { MonthlyEmissionData, ScopeData } from "@/app/dashboard/types";

export function transformBuildingData(
  monthlyRawData: Record<string, MonthlyEmissionData>
) {
  // 1) Acumulo totales por ID de edificio
  const buildingTotals: Record<string, number> = {};
  Object.keys(monthlyRawData).forEach((month) => {
    const monthData = monthlyRawData[month] as {
      building?: Record<string, number>;
    };
    if (monthData.building) {
      Object.entries(monthData.building).forEach(([id, value]) => {
        buildingTotals[id] = (buildingTotals[id] || 0) + value;
      });
    }
  });

  // 2) Genero el listado de IDs (en el orden que vengan)
  const ids = Object.keys(buildingTotals);

  // 3) Mapeo cada ID a un nombre "Edificio X", salvo el 'null' que lo llamo "Otros"
  const idToDisplayName: Record<string, string> = {};
  let counter = 1;
  ids.forEach((id) => {
    if (id === "null") {
      idToDisplayName[id] = "Otros";
    } else {
      idToDisplayName[id] = `Edificio ${counter++}`;
    }
  });

  // 4) Construyo los datos para el chart de scope (pie/bar) manteniendo el color fijo
  const buildingChartData: ScopeData[] = ids.map((id) => ({
    name: idToDisplayName[id],
    value: buildingTotals[id],
  }));

  // 5) Data mensual para el chart de líneas/área
  const monthlyDataBuildings = Object.keys(monthlyRawData).map((month) => {
    const monthData = monthlyRawData[month] as {
      building?: Record<string, number>;
    };
    const record: { month: string; [key: string]: string | number } = { month };
    if (monthData.building) {
      Object.entries(monthData.building).forEach(([buildingId, val]) => {
        const displayName = idToDisplayName[buildingId];
        record[displayName] = val;
      });
    }
    return record;
  });

  // 6) Series keys para el chart (todas las columnas excepto 'month')
  const seriesKeysBuildings = Object.keys(
    monthlyDataBuildings.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if (key !== "month") acc[key] = true;
      });
      return acc;
    }, {} as Record<string, boolean>)
  );

  return {
    buildingChartData,
    monthlyDataBuildings,
    seriesKeysBuildings,
  };
}
