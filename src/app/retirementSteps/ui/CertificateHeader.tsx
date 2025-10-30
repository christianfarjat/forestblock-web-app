import React from "react";

const CertificateHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg md:text-[21px] font-aeonik font-medium text-forestGreen">
        Comprobante de
      </h1>
      <h2 className="text-2xl md:text-[40px] text-forestGreen font-aeonik font-bold">
        Retiro de Crédito de Carbono
      </h2>
    </div>
  );
};

export default CertificateHeader;
