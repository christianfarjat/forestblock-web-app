"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";
import DesktopSidebar from "@/components/Sidebar/DesktopSidebar";
import useDynamicTitle from "@/hooks/useDynamicTitle";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useDynamicTitle();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const publicRoutes = ["/marketplace", "/calculate"];
    const publicRoutePatterns = [/^\/marketplace\/.+$/, /^\/calculate\/.+$/];

    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      publicRoutePatterns.some((pattern) => pattern.test(pathname));

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/marketplace");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return <LoaderScreenDynamic />;
  }

  const pathNamesWithoutSidebard = [""];

  return (
    <div className="flex min-h-screen bg-white">
      {!pathNamesWithoutSidebard.includes(pathname) && <DesktopSidebar />}
      <div className="flex-1 overflow-y-hidden lg:overflow-y-visible bg-white">
        {children}
      </div>
    </div>
  );
}
