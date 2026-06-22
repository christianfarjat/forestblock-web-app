"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useSearchParams } from "next/navigation";
import Logo from "./Logo";
import Menu from "./Menu";
import Divider from "../Divider/Divider";
import { useMenuItems, useIsActive } from "@/utils/menuConfig";
import { useMenuNavigation } from "@/hooks/useMenuNavigation";
import { MobileHamburgerMenuProps } from "./types";

const MobileHamburgerMenu: React.FC<MobileHamburgerMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const { logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = useIsActive(pathname, searchParams);
  const { handleMenuItemClick } = useMenuNavigation();
  const menuItems = useMenuItems();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-forestGreen text-customWhite flex flex-col">
      <div className="flex items-center justify-between h-16 px-6 mt-5">
        <Logo variant="mobile" />
        <button
          onClick={onClose}
          aria-label="Cerrar menú"
          className="focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <Divider customClassName="w-full opacity-10 my-4" />
      <div className="flex-1 overflow-y-auto px-6">
        <Menu
          menuItems={menuItems}
          isAuthenticated={isAuthenticated}
          isActive={isActive}
          onItemClick={(item) => {
            handleMenuItemClick(item);
            onClose();
          }}
          logout={logout}
        />
      </div>
    </div>
  );
};

export default MobileHamburgerMenu;
