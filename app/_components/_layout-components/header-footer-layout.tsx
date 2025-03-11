"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navigation from "./navigation";
import Footer from "./footer";
import AccessProvider from "@/app/_providers/access-provider";

const HeaderFooterLayout = ({ children }: { children: any }) => {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/reset-password");

  const hideFooter = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/accept-invitation",
    "/auth/reset-password",
    "/reset-password",
  ].includes(pathname) || pathname.startsWith("/seatmap");

  const hideNavigation = pathname.startsWith("/seatmap");

  return (
    <>
      {!hideNavigation && <Navigation showSecondaryNav={!isAuthPage} />}
      <AccessProvider>{children}</AccessProvider>
      {!hideFooter && <Footer />}
    </>
  );
};

export default HeaderFooterLayout;
