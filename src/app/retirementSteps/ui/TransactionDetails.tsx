import React from "react";

type TransactionDetailsProps = {
  order: any; //eslint-disable-line
};

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ order }) => {
  return (
    <div className="flex flex-col gap-4 my-5">
      <h3 className="text-customGray text-lg md:text-[21px] font-aeonik font-medium">
        Registro inmutable de transacción:
      </h3>
      <div>
        <h4 className="text-forestGreen font-aeonik text-lg md:text-[21px] font-medium">
          Dirección del beneficiario:
        </h4>
        <h5 className="text-forestGreen font-aeonik text-base md:text-[18px] break-words">
          {order?.beneficiary_address}
        </h5>
      </div>
      <div>
        <h4 className="text-forestGreen font-aeonik text-lg md:text-[21px] font-medium">
          ID de transacción:
        </h4>
        <h5 className="text-forestGreen font-aeonik text-base md:text-[18px] break-words">
          {order?.quote?.uuid}
        </h5>
      </div>
    </div>
  );
};

export default TransactionDetails;
