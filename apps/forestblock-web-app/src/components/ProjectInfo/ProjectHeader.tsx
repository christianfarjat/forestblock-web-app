import React from "react";
import HeaderBackground from "@/components/HeaderBackground/HeaderBackground";
import BackButton from "@/components/BackButton/BackButton";
import ProjectDetails from "@/components/ProjectDetails/ProjectDetails";
import { ProjectHeaderProps } from "./types";

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  name,
  coverImage,
  projectKey,
  country,
  category,
  methodology,
  methodologyName,
  onGoBack,
}) => (
  <HeaderBackground
    coverImage={coverImage || "/images/placeholder.jpg"}
    containerClassName="relative w-full h-[250px] sm:h-[300px] lg:h-[400px] bg-cover bg-center rounded-t-3xl"
    overlayClassName="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded-t-3xl gap-4 p-2 sm:p-4"
  >
    <BackButton onGoBack={onGoBack} text="Marketplace" />
    <h1 className="text-white text-[24px] sm:text-[30px] lg:text-[40px] font-bold font-aeonik text-center p-2 sm:p-3">
      {name}
    </h1>
    <ProjectDetails
      projectKey={projectKey}
      country={country}
      category={category}
      methodology={methodology}
      methodologyName={methodologyName}
      containerClassName="flex flex-wrap items-center justify-center gap-2 lg:gap-5 text-white text-[14px] md:text-[16px] lg:text-[20px] font-aeonik"
    />
  </HeaderBackground>
);

export default ProjectHeader;
