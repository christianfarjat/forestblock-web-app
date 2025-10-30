import React from "react";

const StepLabel = ({
  text,
  isRequired,
}: {
  text: string;
  isRequired?: boolean;
}) => {
  return (
    <label className="block mb-2 text-sm text-customGray">
      {text} {isRequired && <span className="text-red-500">*</span>}
    </label>
  );
};

export default StepLabel;
