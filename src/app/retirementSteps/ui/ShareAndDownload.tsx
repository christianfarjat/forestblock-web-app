import React from "react";
import Link from "next/link";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import SocialShareButtons from "./SocialShareButtons";

type ShareAndDownloadProps = {
  onDownload: () => void;
  loading: boolean;
  shareUrl?: string;
};

const ShareAndDownload: React.FC<ShareAndDownloadProps> = ({
  onDownload,
  loading,
  shareUrl = "",
}) => {
  return (
    <div className="bg-backgroundGray p-4 md:p-5 rounded-2xl flex flex-col gap-4 my-5">
      <h3 className="text-customGray font-aeonik font-medium text-base md:text-[21px]">
        Comparte este Retiro:
      </h3>
      <div className="flex flex-col md:flex-row md:gap-3 gap-5 items-center">
        <button
          className="bg-forestGreen text-softMint px-6 py-2 md:px-10 md:py-3 rounded-full"
          onClick={onDownload}
        >
          {loading ? "Generando..." : "Descargar PDF"}
        </button>
        {shareUrl && (
          <SocialShareButtons
            shareUrl={shareUrl}
            title="¡Mira mi certificado de retiro de créditos de carbono!"
          />
        )}
      </div>
      <div className="flex items-center text-customBlue gap-2 text-sm md:text-[16px] font-neueMontreal font-medium">
        <Link href="/marketplace" className="underline">
          Crea tu propio retiro
        </Link>
        <LiaExternalLinkAltSolid className="w-4 h-4 md:w-4 md:h-4" />
      </div>
    </div>
  );
};

export default ShareAndDownload;
