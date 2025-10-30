import React from "react";
import CountryFlag from "../ProjectCard/CountryFlag";
import MethodologyInfo from "../MethodologyInfo/MethodologyInfo";
import { ProjectDetailsProps } from "./types";

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectKey,
  country,
  category,
  methodology,
  methodologyName,
  containerClassName,
}) => {
  return (
    <div
      className={
        containerClassName ||
        "flex flex-col md:flex-row gap-3 md:gap-7 items-start md:items-center text-sm md:text-[20px]"
      }
    >
      <span className="text-white font-bold font-aeonik">{projectKey}</span>
      <div className="flex items-center gap-2">
        <CountryFlag country={country} />
        <span className="text-white font-aeonik font-medium">{country}</span>
      </div>
      <div className="bg-mintGreen px-3 md:px-5 py-1 md:py-2 rounded-full inline-block self-start text-forestGreen text-xs md:text-[18px] font-neueMontreal">
        {category}
      </div>
      <MethodologyInfo
        methodology={methodology}
        methodologyName={methodologyName}
      />
    </div>
  );
};

export default ProjectDetails;
