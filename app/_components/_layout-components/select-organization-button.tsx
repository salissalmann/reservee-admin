"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/app/_utils/check-route-access";

export const SelectOrganizationButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route is in public routes
  const isPublicRoute = PUBLIC_ROUTES?.some((route) =>
    pathname?.startsWith(route)
  );

  // if (isPublicRoute) {
  //   return null;
  // }

  const isDashbaord = pathname?.startsWith("/dashboard");

  if (!isDashbaord) {
    return null;
  }

  return (
    <Button
      onClick={() => router.push("/select-organization")}
      className="fixed bottom-8 right-8 backdrop-blur-md bg-white/30 border bborder-white/20 shadow-lg hover:bg-white/40 transition-all duration-300 rounded-full p-4 z-50 border-primary"
    >
      Select Organization
    </Button>
  );
};
