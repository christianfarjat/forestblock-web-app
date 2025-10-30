"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ModalContextProps {
  isOpen: boolean;
  openModal: (modalType: string) => void;
  closeModal: () => void;
  currentModal: string | null;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  const openModal = useCallback((modalType: string) => {
    setCurrentModal(modalType);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        currentModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
