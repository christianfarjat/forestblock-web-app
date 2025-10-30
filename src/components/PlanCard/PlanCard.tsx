import React from "react";
import Divider from "../Divider/Divider";
import Image from "next/image";
import { PlanCardProps } from "./types";

interface Props extends PlanCardProps {
  onSelectPlan?: () => void;
}

const PlanCard: React.FC<Props> = ({
  title,
  description,
  features,
  popular,
  onSelectPlan,
}) => {
  return (
    <div className="relative">
      {popular && (
        <div className="absolute z-20 left-1/2 -top-20 transform -translate-x-1/2 flex-col items-center hidden lg:flex">
          <div className="bg-customGreen text-forestGreen px-3 py-1 rounded-full text-sm font-bold">
            Más popular
          </div>
          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-customGreen"></div>
        </div>
      )}
      <div
        className={`flex flex-col items-start px-5 py-2 bg-white shadow hover:shadow-lg transition rounded-2xl ${
          popular ? "border-2 border-customGreen relative lg:bottom-7 z-10" : ""
        }`}
      >
        <h2 className="text-[37px] font-bold mb-2 mx-auto">{title}</h2>
        <p className="text-[18px] mb-4 mx-auto text-center">{description}</p>
        <Divider customClassName="w-full mb-5" />
        <ul className="mb-4 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 mt-1">
                <Image
                  src="/images/check.svg"
                  alt="Check icon"
                  width={20}
                  height={20}
                />
              </span>
              <span className="ml-2 text-[18px] block">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          className="mt-auto bg-customGreen text-forestGreen py-2 rounded-full hover:bg-customGreen/80 transition mx-auto px-10 font-aeonik font-medium mb-10 w-[80%]"
          onClick={onSelectPlan} 
        >
          Seleccionar este plan
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
