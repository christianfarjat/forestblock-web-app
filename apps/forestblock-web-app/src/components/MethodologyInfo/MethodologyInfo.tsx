import React from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MethodologyInfoProps } from "./types";

const MethodologyInfo = ({
  methodology,
  methodologyName,
  isTextWhite = true,
}: MethodologyInfoProps) => {
  const textColorClass = isTextWhite ? "text-white" : "text-black";

  return (
    <div className="flex items-center gap-2 relative">
      <span
        className={`${textColorClass} text-forestGreen font-aeonik font-medium text-base md:text-[20px]`}
      >
        {methodology}
      </span>
      <div className="relative group">
        <IoIosInformationCircleOutline
          className={`${textColorClass} cursor-pointer`}
        />
        {/* Mobile: tooltip a la izquierda; Desktop: tooltip sobre el ícono */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 right-full mr-2
            w-max max-w-[200px] px-3 py-2 bg-gray-500 text-white text-xs rounded-lg
            opacity-0 group-hover:opacity-100 transition-opacity
            md:bottom-full md:left-1/2 md:top-auto md:right-auto md:mb-2 md:transform md:-translate-x-1/2 md:translate-y-0
          `}
        >
          {methodologyName}
          {/* Flecha: en mobile, pegada al tooltip; en desktop, la original */}
          <div
            className={`
              absolute top-1/2 left-full -translate-y-1/2 -ml-2
              w-3 h-3 bg-gray-500 rotate-45
              md:bottom-2 md:left-1/2 md:top-auto md:right-auto md:translate-y-full md:-translate-x-1/2 md:ml-0
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default MethodologyInfo;
