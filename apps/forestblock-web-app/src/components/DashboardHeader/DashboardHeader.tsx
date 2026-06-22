"use client";

import React from "react";
import YearSelector from "@/components/YearSelector/YearSelector";

interface DashboardHeaderProps {
  title: string;
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  isDisabled?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  availableYears,
  selectedYear,
  onYearChange,
}) => (
  <div className="flex flex-row justify-between items-center mb-10">
    <h1 className="text-[28px] md:text-[40px] font-aeonik font-bold text-forestGreen">
      {title}
    </h1>
    <YearSelector
      availableYears={availableYears}
      selectedYear={selectedYear}
      onYearChange={onYearChange}
      isDisabled={false}
    />
  </div>
);

export default DashboardHeader;
