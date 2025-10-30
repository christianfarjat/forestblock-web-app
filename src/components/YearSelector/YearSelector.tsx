import React from "react";
import { CiCalendar } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";

interface YearSelectorProps {
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  isDisabled?: boolean;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  availableYears,
  selectedYear,
  onYearChange,
  isDisabled = false,
}) => (
  <div className="relative w-fit">
    <CiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    <select
      disabled={isDisabled}
      value={selectedYear}
      onChange={(e) => onYearChange(Number(e.target.value))}
      className="cursor-pointer pl-10 pr-8 py-2 border border-gray-300 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-forestGreen appearance-none px-10"
    >
      {availableYears.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
    <FaChevronDown
      size={10}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);

export default YearSelector;
