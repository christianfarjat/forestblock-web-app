import { DashboardCategory, PieCategoryData } from "@/app/dashboard/types";
import { Category } from "@/hooks/useCategories";

export function transformCategoryData(
  dashboardCategories: Record<string, DashboardCategory>,
  dynamicCategories: Category[] | Record<string, Category>
) {
  // Ordenamos las claves de categorías por emisiones de mayor a menor
  const dashboardCatKeys = Object.keys(dashboardCategories);
  dashboardCatKeys.sort(
    (a, b) =>
      dashboardCategories[b].emissions - dashboardCategories[a].emissions
  );

  // Tomamos las 5 principales categorías
  const topCategoryKeys = dashboardCatKeys.slice(0, 5);

  // Mapeamos los nombres para cada clave de categoría
  const keyDisplayMapping: Record<string, string> = {};
  for (const key of topCategoryKeys) {
    const dynCat: Category | undefined = Array.isArray(dynamicCategories)
      ? dynamicCategories.find((cat: Category) => cat.code === key)
      : Object.values(dynamicCategories as Record<string, Category>).find(
          (cat) => cat?.code === key
        );
    keyDisplayMapping[key] =
      dynCat?.name || dashboardCategories[key].name || key;
  }

  // Creamos el arreglo para el gráfico (Pie)
  const topCategoryDataForPie: PieCategoryData[] = topCategoryKeys.map(
    (key) => {
      const cat = dashboardCategories[key];
      const dynCat: Category | undefined = Array.isArray(dynamicCategories)
        ? dynamicCategories.find((c: Category) => c.code === key)
        : Object.values(dynamicCategories as Record<string, Category>).find(
            (c) => c.code === key
          );
      return {
        name: keyDisplayMapping[key],
        value: cat.emissions,
        color: dynCat?.color || cat.color || "#8884d8",
      };
    }
  );

  // Sumar el resto de emisiones como "Further"
  const othersValue = dashboardCatKeys
    .slice(5)
    .reduce((acc, key) => acc + (dashboardCategories[key].emissions || 0), 0);
  topCategoryDataForPie.push({
    name: `+${dashboardCatKeys.length - 5} Further`,
    value: othersValue,
    color: "#cccccc",
  });

  return { topCategoryKeys, keyDisplayMapping, topCategoryDataForPie };
}
