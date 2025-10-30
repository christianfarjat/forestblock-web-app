import React from "react";

const Timer = ({
  minutes,
  seconds,
  amount,
}: {
  minutes: number;
  seconds: number;
  amount: number;
}) => {
  return (
    <div className="flex flex-col gap-5 p-0 md:p-6">
      <p className="text-sm md:text-[19px] font-neueMontreal font-medium text-customGray">
        Tenés 10 minutos para realizar la transferencia sino se cancelará la
        orden
      </p>
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="flex items-center justify-center bg-[#E6E6E6] rounded-2xl px-6 md:px-12 py-4 md:py-6 w-full md:w-[320px]">
          <div className="flex flex-row gap-4 md:gap-6 text-gray-800 font-semibold text-2xl md:text-[32px] justify-center items-center">
            <div className="flex flex-col items-center">
              <span className="text-mossGreen font-neueMontreal font-medium text-xl md:text-[31px]">
                {minutes}
              </span>
              <span className="text-xs md:text-[17px] font-neueMontreal font-medium text-mossGreen/80">
                Minutos
              </span>
            </div>

            <div className="hidden md:block w-[1px] h-[50px] bg-gray-500"></div>

            <div className="flex flex-col items-center">
              <span className="text-mossGreen font-neueMontreal font-medium text-xl md:text-[31px]">
                {seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-xs md:text-[17px] font-neueMontreal font-medium text-mossGreen/80">
                Segundos
              </span>
            </div>
          </div>
        </div>

        <div className="block md:hidden h-[1px] w-full bg-gray-200"></div>
        <div className="hidden md:block w-[1px] h-[70px] bg-gray-200"></div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <p className="font-bold font-aeonik text-forestGreen text-lg md:text-[19px]">
            Monto a transferir
          </p>
          <div className="bg-mintGreen rounded-xl px-3 md:px-4 py-1">
            <p className="text-forestGreen font-aeonik font-bold text-lg md:text-[23px] text-center">
              ${amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
