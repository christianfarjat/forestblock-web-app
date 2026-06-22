"use client";

import ProjectHeader from "@/components/ProjectInfo/ProjectHeader";
import SustainableGoals from "@/components/ProjectInfo/SustainableGoals";
import RegistryInfo from "@/components/ProjectInfo/RegistryInfo";
import ListingCard from "@/components/ListingCard/ListingCard";
import { Project } from "@/types/project";
import { Match, RetireParams } from "@/types/marketplace";
import ProjectDescription from "./ProjectDescription";
import Collapsible from "@/components/Collapsible/Collapsible";
import StatsCard from "./Stats";
import Gallery from "./Gallery";
import TopBar from "../TopBar/TopBar";
import { useRouter } from "next/navigation";

const ProjectInfo = ({
  project,
  handleRetire,
  matches,
  selectedVintage,
  displayPrice,
  priceParam,
  isPricesLoading,
}: {
  project: Project;
  handleRetire: (params: RetireParams) => void;
  matches: Match[];
  selectedVintage: string | undefined;
  displayPrice: string | undefined;
  priceParam: string | null;
  isPricesLoading: boolean;
}) => {
  const router = useRouter();

  const location =
    project?.location?.geometry?.coordinates.length === 2
      ? {
          ...project.location,
          geometry: {
            ...project.location.geometry,
            coordinates: [
              project.location.geometry.coordinates[0],
              project.location.geometry.coordinates[1],
            ] as [number, number],
          },
        }
      : null;

  return (
    <div className="flex flex-col min-h-screen w-full rounded-xl">
      <TopBar />
      <ProjectHeader
        name={project.name}
        coverImage={project.coverImage?.url}
        projectKey={project.key}
        country={project.country}
        category={project.methodologies[0].category}
        methodology={project.methodologies[0].id}
        methodologyName={project.methodologies[0].name}
        onGoBack={() => router.back()}
      />
      <div className="flex flex-col lg:flex-row flex-grow gap-6 bg-backgroundGray overflow-visible rounded-b-3xl md:px-6 pb-28">
        <div className="lg:w-3/5 space-y-6 order-2 lg:order-1 md:p-0 px-5">
          <div>
            <Collapsible title="Descripción">
              <ProjectDescription project={project} />
            </Collapsible>
          </div>
          <div>
            <Collapsible title="Objetivos de Desarrollo Sostenible">
              <SustainableGoals goals={project.sustainableDevelopmentGoals} />
            </Collapsible>
          </div>
          <div>
            <Collapsible title="Estadísticas">
              <StatsCard stats={project.stats} />
            </Collapsible>
          </div>
          {project.images.length > 1 && (
            <div>
              <Collapsible title="Galería">
                <Gallery images={project.images} location={location} />
              </Collapsible>
            </div>
          )}
        </div>
        <div className="lg:w-2/6 md:-mt-16 md:sticky md:top-10 md:h-screen flex flex-col gap-5 order-1 lg:order-2">
          <ListingCard
            handleRetire={handleRetire}
            matches={matches}
            selectedVintage={selectedVintage}
            displayPrice={displayPrice}
            priceParam={priceParam}
            isPricesLoading={isPricesLoading}
          />
          <RegistryInfo url={project.url} />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
