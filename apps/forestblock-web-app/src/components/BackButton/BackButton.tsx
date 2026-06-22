import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BackButtonProps } from "./types";

const BackButton: React.FC<BackButtonProps> = ({ onGoBack, text }) => {
  return (
    <button
      className="absolute top-4 left-4 flex items-center gap-2 text-white p-2 rounded-full transition"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      onClick={onGoBack}
    >
      <div className="flex items-center justify-center w-6 h-6 border border-white rounded-full">
        <IoIosArrowBack size={12} className="text-white" />
      </div>
      <span className="hidden lg:inline text-white text-[17px] font-aeonik font-medium">
        {text}
      </span>
    </button>
  );
};

export default BackButton;
