import React from "react";

type FormattedDateProps = {
  date?: string | null;
};

const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  const formattedDate = parsedDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Reemplaza "de" adicional para mejorar la legibilidad
  const finalDate = formattedDate.replace(/(\d+ de \w+) de (\d+)/, "$1, $2");

  return (
    <span className="text-customGray text-sm md:text-[18px] font-neueMontreal font-medium">
      {finalDate}
    </span>
  );
};

export default FormattedDate;
