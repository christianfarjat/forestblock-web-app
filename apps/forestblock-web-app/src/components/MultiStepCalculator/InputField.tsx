import React from "react";
import { NumberFormatBase } from "react-number-format";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  min?: number;
  checked?: boolean;
  placeholder?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  min,
  checked,
  placeholder,
  className,
}) => {
  if (type === "number") {
    return (
      <div>
        <label className={`block font-bold ${className}`}>{label}</label>
        <NumberFormatBase
          name={name}
          value={value}
          onValueChange={({ value: numericValue }) =>
            onChange({
              target: { value: numericValue },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          min={min}
          className="border p-2 w-full"
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div>
      <label className={`block font-bold ${className}`}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        checked={checked}
        className="border p-2 w-full"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
