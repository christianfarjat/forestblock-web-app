import React from "react";

type TonnesDisplayProps = {
  quantity?: number | string | null;
};

const TonnesDisplay: React.FC<TonnesDisplayProps> = ({ quantity }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-7xl md:text-9xl font-bold font-aeonik text-softMint">
        {quantity}t
      </p>
      <p className="text-customGray text-base md:text-[18px] font-aeonik font-bold">
        TONELADAS DE CARBONO VERIFICADAS Y RETIRADAS
      </p>
    </div>
  );
};

export default TonnesDisplay;
