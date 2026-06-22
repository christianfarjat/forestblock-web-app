"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ModalProps } from "./types";

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Evita scroll en el fondo
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] md:w-full md:max-w-md rounded-3xl bg-white p-6 md:p-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-5 text-forestGreen font-bold text-sm bg-[#EAEAEA] w-8 h-8 flex items-center justify-center rounded-full"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};
