import React from "react";
import type { Metadata } from "next";
import { Inter, Nunito, Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./_providers/providers";
import { SelectOrganizationButton } from "./_components/_layout-components/select-organization-button";
import RouteAccessErrorModal from "./_components/_layout-components/route-access-error-modal";
import HeaderFooterLayout from "./_components/_layout-components/header-footer-layout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "get in",
  description: "get in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${inter.className} min-h-screen bg-background dark:bg-tertiary`}
      >
        <Providers>
          <Toaster position="top-center" reverseOrder={false} />
          <RouteAccessErrorModal />
          <HeaderFooterLayout>
            <div className="min-h-[calc(100vh-20rem)]">{children}</div>
          </HeaderFooterLayout>
          <SelectOrganizationButton />
        </Providers>
      </body>
    </html>
  );
}
