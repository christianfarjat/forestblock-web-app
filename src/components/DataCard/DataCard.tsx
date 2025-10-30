interface DataCardProps {
  title: string;
  value: string | number | undefined;
  unit?: string;
  variant?: "primary" | "secondary";
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  unit,
  variant = "secondary",
}) => {
  const baseStyles = "rounded-2xl p-10 text-start font-aeonik";
  const primaryStyles = "bg-forestGreen text-white";
  const secondaryStyles = "bg-white border-2 border-gray-200 text-gray-700";

  const containerClass = `${baseStyles} ${
    variant === "primary" ? primaryStyles : secondaryStyles
  }`;

  const titleClass = `text-lg mb-2 ${
    variant === "primary" ? "font-medium" : ""
  }`;
  const valueClass =
    variant === "primary"
      ? "text-3xl font-bold"
      : "text-3xl font-bold text-forestGreen";

  return (
    <div className={containerClass}>
      <h3 className={titleClass}>{title}</h3>
      {unit ? (
        <div className="flex items-center space-x-3">
          <p className={valueClass}>{value}</p>
          <span className="text-md">{unit}</span>
        </div>
      ) : (
        <p className={valueClass}>{value}</p>
      )}
    </div>
  );
};

export default DataCard;
