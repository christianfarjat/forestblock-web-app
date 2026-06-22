import React from "react";

const StepContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="md:p-6 p-3 bg-white rounded-xl">{children}</div>;
};

export default StepContainer;
