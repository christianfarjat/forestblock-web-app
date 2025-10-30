import CountryFlag from "@/components/ProjectCard/CountryFlag";
import React from "react";
import { ProjectInfoProps } from "../types";
import MethodologyInfo from "@/components/MethodologyInfo/MethodologyInfo";

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  methodologyName,
  project,
  index,
}) => {
  return (
    <div className="flex items-center divide-x divide-gray-300">
      <div className="flex items-center gap-2 px-3">
        <p className="text-forestGreen font-neueMontreal font-medium">
          Ubicación:
        </p>
        <div className="flex items-center gap-2">
          <CountryFlag country={project?.country} />
          <span className="text-forestGreen font-aeonik font-medium">
            {project?.country}
          </span>
        </div>
      </div>

      <div className="flex items-center px-3">
        <span className="text-forestGreen font-neueMontreal font-medium">
          {typeof index === "number" ? project?.vintages[index] : ""}
        </span>
      </div>

      <div className="flex items-center px-3">
        <MethodologyInfo
          methodology={project?.methodologies[0]?.name || ""}
          methodologyName={methodologyName}
          isTextWhite={false}
        />
      </div>
    </div>
  );
};

export default ProjectInfo;
