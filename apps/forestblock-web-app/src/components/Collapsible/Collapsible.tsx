"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Collapsible = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleCollapsible = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <button
        onClick={toggleCollapsible}
        className="w-full flex justify-between items-center py-3 sm:py-4 hover:bg-gray-200 focus:outline-none focus:ring border-b-[1px] border-borderGray"
      >
        <span className="text-[18px] sm:text-[23px] font-medium font-aeonik">
          {title}
        </span>
        {isOpen ? (
          <FaChevronUp className="text-[16px] sm:text-[20px]" />
        ) : (
          <FaChevronDown className="text-[16px] sm:text-[20px]" />
        )}
      </button>
      {isOpen && <div className="py-4 sm:py-5">{children}</div>}
    </div>
  );
};

export default Collapsible;
