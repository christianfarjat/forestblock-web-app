import React from "react";
import { QuantitySelectorProps } from "./types";

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  setValue,
  min,
  max,
  step = 0.1,
  disabled = false,
}) => {
  const isDecrementDisabled = value <= min || disabled;
  const isIncrementDisabled = value >= max || disabled;

  const getDynamicStep = () => {
    const diff = max - value;
    return diff >= 1 ? 1 : step;
  };

  const increment = () => {
    const dynamicStep = getDynamicStep();
    const newValue = value + dynamicStep;
    if (newValue <= max) {
      setValue(Number(newValue?.toFixed(2)));
    } else {
      setValue(Number(max?.toFixed(2)));
    }
  };

  const decrement = () => {
    const dynamicStep = getDynamicStep();
    const newValue = value - dynamicStep;
    if (newValue >= min) {
      setValue(Number(newValue?.toFixed(2)));
    } else {
      setValue(Number(min?.toFixed(2)));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue) && inputValue >= min && inputValue <= max) {
      setValue(Number(inputValue?.toFixed(2)));
    } else if (inputValue < min) {
      setValue(min);
    } else if (inputValue > max) {
      setValue(max);
    }
  };

  return (
    <div
      className={`flex items-center border border-gray-300 rounded-full overflow-hidden ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <button
        type="button"
        className="px-4 py-2 border-r border-gray-300 text-black font-bold"
        onClick={decrement}
        disabled={isDecrementDisabled}
      >
        -
      </button>
      <input
        type="number"
        step={step}
        className="w-20 text-center border-0 outline-none text-[19px] font-neueMontreal font-medium"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
      />
      <button
        type="button"
        className="px-4 py-2 border-l border-gray-300 text-black font-bold"
        onClick={increment}
        disabled={isIncrementDisabled}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
