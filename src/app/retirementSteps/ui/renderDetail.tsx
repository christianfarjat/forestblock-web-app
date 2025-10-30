const renderDetail = ({
  label,
  value,
  className,
  isStrong,
}: {
  label: string;
  value: string | JSX.Element | null;
  className?: string;
  isStrong?: boolean;
}) => (
  <div className={`flex gap-2 text-[18px] ${className}`}>
    <span
      className={`${
        isStrong
          ? "text-forestGreen font-neueMontreal font-bold"
          : "font-aeonik"
      }`}
    >
      {label}:
    </span>
    <span
      className={`${isStrong ? "text-forestGreen font-aeonik" : "font-aeonik"}`}
    >
      {value || "No disponible"}
    </span>
  </div>
);

export default renderDetail;
