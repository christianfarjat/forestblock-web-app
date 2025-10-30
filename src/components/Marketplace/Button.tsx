import { FC } from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "quinary"
    | "danger";
  onClick?: () => void;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  selected?: boolean;
};

const Button: FC<ButtonProps> = ({
  children,
  variant,
  onClick,
  isDisabled,
  type,
  className,
  selected = false,
}) => {
  const baseClasses = `px-4 py-2 md:px-6 md:py-3 rounded-full shadow text-[14px] md:text-[16px] font-neueMontreal font-medium transition duration-300 ${
    isDisabled ? "cursor-not-allowed" : ""
  } relative group`;

  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary:
      "bg-transparent border border-white text-white hover:bg-gray-200 hover:bg-opacity-5",
    danger: "bg-red-600 text-white hover:bg-red-700",
    tertiary: "bg-gray-200 text-black hover:bg-gray-300",
    quaternary: "bg-forestGreen text-white hover:bg-forestGreen/80 ",
    quinary: "bg-customGreen text-forestGreen hover:bg-mintGreen/80",
  };

  const selectedClasses = "bg-customGreen text-black hover:bg-customGreen/80";

  const finalClasses = selected
    ? `${baseClasses} ${selectedClasses} ${className || ""}`
    : `${baseClasses} ${variants[variant]} ${className || ""}`;

  return (
    <div className="relative group">
      <button
        disabled={isDisabled}
        className={finalClasses}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
