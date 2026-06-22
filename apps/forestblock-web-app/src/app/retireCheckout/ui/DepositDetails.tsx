import { FaRegCopy } from "react-icons/fa";
// import { QRCodeCanvas } from "qrcode.react";
import { DepositDetailsProps } from "../types";

const DepositDetails: React.FC<DepositDetailsProps> = ({
  address,
  // qrPayload,
}) => {
  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert("Dirección copiada al portapapeles.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 md:gap-4 relative">
        <div className="w-6 h-6 md:w-6 md:h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full"></div>
        </div>
        <p className="font-aeonik font-medium text-forestGreen text-lg md:text-[23px]">
          Dirección de depósito
        </p>
      </div>
      <div className="border rounded-3xl p-2 md:p-4 flex flex-col md:flex-row items-center gap-3">
        {/* <div className="flex-shrink-0">
          <QRCodeCanvas
            value={qrPayload}
            size={100}
            className="block md:hidden"
          />
          <QRCodeCanvas
            value={qrPayload}
            size={150}
            className="hidden md:block"
          />
        </div> */}
        <div className="flex flex-col gap-1 w-full">
          <span className="font-medium font-neueMontreal text-customGray text-xs md:text-[16px]">
            Dirección
          </span>
          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <span className="w-full break-all whitespace-normal font-neueMontreal font-medium text-sm md:text-[18px]">
              {address}
            </span>
            <button
              onClick={handleCopy}
              className="text-[#182D1F] hover:text-[#182D1F/80] flex-shrink-0"
            >
              <FaRegCopy size={16} className="md:hidden" />
              <FaRegCopy size={18} className="hidden md:block" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositDetails;
