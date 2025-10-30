"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { MenuItem } from "@/components/Sidebar/types";

export const useMenuNavigation = () => {
  const router = useRouter();
  const { isAuthenticated, setRedirectUrl } = useAuth();
  const { openModal } = useModal();

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.href?.startsWith("http")) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    if (
      !isAuthenticated &&
      (item.href?.startsWith("/dashboard") || item.href === "/retirements")
    ) {
      setRedirectUrl(item.href);
      openModal("login");
      return;
    }

    if (item.href) {
      router.push(item.href);
    }
  };

  return { handleMenuItemClick };
};
