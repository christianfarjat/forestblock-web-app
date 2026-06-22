"use client";

import React, { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaRegBell, FaRegUser, FaBars } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { Modal } from "../Modal/Modal";
import { LoginModal } from "../LoginModal/LoginModal";
import MobileHamburgerMenu from "../Sidebar/MobileMenu";

const TopBar = () => {
  const { isAuthenticated, user, setMenuOpen, menuOpen } = useAuth();
  const { openModal, isOpen, closeModal, currentModal } = useModal();

  const pathname = usePathname();

  const onClose = useCallback(() => {
    setMenuOpen(false);
    closeModal();
  }, [setMenuOpen, closeModal]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <div>
      <div className="flex justify-between items-center w-full py-4 px-3 md:py-7 md:px-5 bg-backgroundGray rounded-2xl shadow-sd mb-5">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="focus:outline-none"
            >
              <FaBars className="text-forestGreen text-xl md:text-2xl" />
            </button>
          </div>
          <h1 className="font-medium font-aeonik text-[16px] md:text-[20px] text-forestGreen">
            Bienvenido a Forestblock,{" "}
            {isAuthenticated ? user?.email : "Invitado."}
          </h1>
        </div>

        {isOpen && currentModal === "login" && (
          <Modal isOpen={isOpen} onClose={closeModal}>
            <LoginModal />
          </Modal>
        )}

        {isAuthenticated ? (
          <div className="flex items-center space-x-3 md:space-x-4">
            <div
              id="notification-icon"
              className="bg-white rounded-full hover:bg-gray-200 cursor-pointer p-2 md:p-3"
            >
              <FaRegBell className="text-lg md:text-xl text-forestGreen" />
            </div>
            <Link href="/profile">
              <div className="relative w-10 h-10 md:w-14 md:h-14 cursor-pointer">
                <Image
                  src={"/images/profile.png"}
                  alt="Perfil"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full border-2 border-gray-200"
                />
              </div>
            </Link>
          </div>
        ) : (
          <div
            onClick={() => openModal("login")}
            className="bg-forestGreen rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-colors"
          >
            <FaRegUser className="text-mintGreen text-xl md:text-2xl" />
          </div>
        )}
      </div>

      <MobileHamburgerMenu isOpen={menuOpen} onClose={onClose} />
    </div>
  );
};

export default TopBar;
