"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useYearRange } from "./useYearRange";
import { useEffect } from "react";

export const usePersistedYear = (defaultYearsCount = 10) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const queryYear = searchParams.get("year");
  const initialYear = queryYear ? Number(queryYear) : undefined;

  const yearRange = useYearRange(defaultYearsCount, initialYear);

  useEffect(() => {
    if (queryYear && Number(queryYear) !== yearRange.selectedYear) {
      yearRange.setSelectedYear(Number(queryYear));
    }
  }, [queryYear, yearRange]);

  const handleYearChange = (year: number) => {
    yearRange.setSelectedYear(year);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("year", String(year));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return {
    ...yearRange,
    handleYearChange,
  };
};
