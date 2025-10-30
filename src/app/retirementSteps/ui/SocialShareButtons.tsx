"use client";

import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaBan } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";

type SocialButtonProps = {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  onClick,
  disabled = false,
}) => {
  return (
    <div className="relative inline-block group">
      <button
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        className={`bg-forestGreen text-softMint p-3 rounded-full ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-forestGreen-hover"
        }`}
      >
        {icon}
      </button>
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <FaBan className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

const getFacebookShareUrl = (shareUrl: string, title?: string) => {
  let url =
    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(shareUrl);
  if (title) {
    url += "&quote=" + encodeURIComponent(title);
  }
  return url;
};

const getTwitterShareUrl = (shareUrl: string, title?: string) => {
  return (
    "https://twitter.com/intent/tweet?url=" +
    encodeURIComponent(shareUrl) +
    "&text=" +
    encodeURIComponent(title || "")
  );
};

const getLinkedinShareUrl = (shareUrl: string) => {
  return (
    "https://www.linkedin.com/sharing/share-offsite/?url=" +
    encodeURIComponent(shareUrl)
  );
};

const openShareWindow = (url: string) => {
  const width = 600;
  const height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;
  window.open(
    url,
    "_blank",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, 
    scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, 
    height=${height}, top=${top}, left=${left}`
  );
};

type SocialShareButtonsProps = {
  shareUrl: string;
  title?: string;
};

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  shareUrl,
  title = "¡Mira mi certificado de retiro de créditos de carbono!",
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("¡URL copiada al portapapeles!");
    } catch (err) {
      console.error("Error al copiar la URL", err);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <SocialButton
        icon={<FaFacebookF size={30} />}
        onClick={() => openShareWindow(getFacebookShareUrl(shareUrl, title))}
      />
      <SocialButton
        icon={<FaTwitter size={30} />}
        onClick={() => openShareWindow(getTwitterShareUrl(shareUrl, title))}
      />
      <SocialButton
        icon={<FaLinkedinIn size={30} />}
        onClick={() => openShareWindow(getLinkedinShareUrl(shareUrl))}
      />
      <SocialButton icon={<IoCopyOutline size={30} />} onClick={handleCopy} />
    </div>
  );
};

export default SocialShareButtons;
