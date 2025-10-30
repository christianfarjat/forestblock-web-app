"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMenuItems } from "@/utils/menuConfig";
import { MenuItem } from "@/components/Sidebar/types";

const useDynamicTitle = (): void => {
  const pathname = usePathname();
  const menuItems = useMenuItems();

  useEffect(() => {
    const defaultTitle = "Forestblock";

    const findTitle = (items: MenuItem[]): string | null => {
      for (const item of items) {
        if (item.href && pathname.startsWith(item.href)) {
          return `Forestblock - ${item.label}`;
        }
        if (item.children?.length) {
          const childTitle = findTitle(item.children);
          if (childTitle) return childTitle;
        }
      }
      return null;
    };

    const newTitle = findTitle(menuItems);
    document.title = newTitle || defaultTitle;
  }, [pathname, menuItems]);
};

export default useDynamicTitle;
