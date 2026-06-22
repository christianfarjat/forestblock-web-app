import { Project } from "@/types/project";
import React from "react";

const ProjectDescription = ({ project }: { project: Project }) => {
  return (
    <div className="text-[16px] sm:text-[18px] text-gray-800 font-neueMontreal">
      <p>{project.long_description}</p>
    </div>
  );
};

export default ProjectDescription;
