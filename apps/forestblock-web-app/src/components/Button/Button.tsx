import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled,
  variant = "primary",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center 
        whitespace-nowrap
        min-w-[180px] 
        px-6 sm:px-12 lg:px-32  /* Ajusta breakpoints según necesites */
        py-3 
        rounded-3xl 
        font-medium 
        font-aeonik 
        text-[18px] 
        transition
        ${
          variant === "primary"
            ? "bg-mintGreen text-forestGreen"
            : "border border-forestGreen text-forestGreen bg-none"
        }
        ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed border-none"
            : ""
        }
      `}
    >
      {text}
    </button>
  );
};

export default Button;
