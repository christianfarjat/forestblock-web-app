import { Project } from "@/types/project";

const categoryImages: Record<string, string> = {
  Agriculture: "/images/categories/agriculture.png",
  "Blue Carbon": "/images/categories/blue_carbon.png",
  "Energy Efficiency": "/images/categories/energy_efficiency.png",
  Forestry: "/images/categories/forestry.png",
  "Industrial Processing": "/images/categories/industrial_processing.png",
  Other: "/images/categories/other.png",
  "Renewable Energy": "/images/categories/renewable_energy.png",
};

export function getProjectImage(project: Project): string {
  return (
    project.coverImage?.url ||
    (project.images?.length > 0 && project.images[0].url) ||
    categoryImages[project.methodologies?.[0]?.category] ||
    "/images/categories/other.png"
  );
}
