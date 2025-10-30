import { useState, useMemo } from "react";

export const useYearRange = (defaultYearsCount = 10, initialYear?: number) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(
    initialYear ?? currentYear
  );

  const availableYears = useMemo(
    () => Array.from({ length: defaultYearsCount }, (_, i) => currentYear - i),
    [currentYear, defaultYearsCount]
  );

  const startDate = `${selectedYear}-01-01`;
  const endDate = `${selectedYear}-12-31`;

  return {
    selectedYear,
    setSelectedYear,
    availableYears,
    startDate,
    endDate,
    currentYear,
  };
};
