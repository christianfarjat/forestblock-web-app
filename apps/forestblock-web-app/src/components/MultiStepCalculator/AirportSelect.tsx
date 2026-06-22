"use client";

import React, { useState } from "react";
import { Option } from "./steps/types";
import VirtualizedSelect from "../VirtualizedSelect/VirtualizedSelect";

interface AirportSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  isRequired?: boolean;
}

const AirportSelect: React.FC<AirportSelectProps> = ({
  value,
  options,
  onChange,
  placeholder,
  isRequired,
}) => {
  const [touched, setTouched] = useState(false);
  const showError = isRequired && touched && !value;

  return (
    <div>
      {/* <label className="block font-bold">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label> */}
      <VirtualizedSelect
        options={options}
        value={value}
        onChange={(val) => {
          onChange(val);
          setTouched(true);
        }}
        placeholder={placeholder || ""}
      />
      {showError && (
        <span className="text-red-500 text-xs">Este campo es obligatorio.</span>
      )}
    </div>
  );
};

export default AirportSelect;
