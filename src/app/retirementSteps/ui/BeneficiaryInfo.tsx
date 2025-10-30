import React from "react";

type BeneficiaryInfoProps = {
  beneficiary_name: string;
  retirement_message: string;
};

const BeneficiaryInfo: React.FC<BeneficiaryInfoProps> = ({
  beneficiary_name,
  retirement_message,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-forestGreen font-aeonik text-lg md:text-[21px]">
          Beneficiario:
        </h3>
        <p className="text-forestGreen font-aeonik font-medium text-lg md:text-[21px]">
          {beneficiary_name}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-forestGreen font-aeonik text-lg md:text-[21px]">
          Mensaje de retiro:
        </h3>
        <p className="text-forestGreen font-aeonik font-medium text-lg md:text-[21px]">
          {retirement_message}
        </p>
      </div>
    </div>
  );
};

export default BeneficiaryInfo;
