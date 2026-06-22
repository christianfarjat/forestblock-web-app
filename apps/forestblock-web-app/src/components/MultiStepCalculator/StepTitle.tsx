import React from "react";

const StepTitle = ({ title }: { title: string }) => {
  return <h2 className="text-xl font-bold mb-6 text-customGray">{title}</h2>;
};

export default StepTitle;
