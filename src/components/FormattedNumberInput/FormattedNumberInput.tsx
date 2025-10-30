import React, { FC } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface FormattedNumberInputProps
  extends Omit<NumericFormatProps, "onValueChange" | "onChange"> {
  value: number | string;
  onChange: (value: number | string) => void;
}

const FormattedNumberInput: FC<FormattedNumberInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <NumericFormat
      style={{
        borderRadius: "9999px",
      }}
      value={value}
      onValueChange={({ value }) => onChange(value)}
      thousandSeparator={true}
      allowNegative={false}
      {...props}
    />
  );
};

export default FormattedNumberInput;
