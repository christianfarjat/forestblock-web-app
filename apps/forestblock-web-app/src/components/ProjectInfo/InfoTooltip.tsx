import React from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { InfoTooltipProps } from "./types";

const InfoTooltip = ({ text, tooltipText }: InfoTooltipProps) => (
  <div className="flex items-center gap-2">
    <span className="text-md md:text-[23px] font-aeonik font-medium">
      {text}
    </span>
    <div className="relative group">
      <IoIosInformationCircleOutline className="text-gray-600 cursor-pointer text-lg md:text-[20px]" />
      <div
        className="
          absolute
          bottom-full
          left-1/2
          transform
          -translate-x-1/2
          mb-2
          max-w-[300px]
          w-auto
          px-2
          py-1
          md:px-3
          md:py-2
          bg-gray-500
          text-white
          text-[10px]
          md:text-xs
          rounded-lg
          opacity-0
          group-hover:opacity-100
          transition-opacity
          font-aeonik
          font-medium
          pointer-events-none
          whitespace-normal
          break-words

          /* Comportamiento en desktop (md en adelante) */
          md:w-max
          md:max-w-none
          md:whitespace-nowrap
        "
      >
        {tooltipText}
        <div
          className="
            absolute
            bottom-2
            left-1/2
            transform
            -translate-x-1/2
            translate-y-full
            w-3
            h-3
            bg-gray-500
            rotate-45
            pointer-events-none
          "
        />
      </div>
    </div>
  </div>
);

export default InfoTooltip;
