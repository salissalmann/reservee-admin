"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { useCheckRouteAccess } from "@/app/_utils/check-route-access";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";

type RouteConfig = {
  path: string;
  role_name?: string;
  eventId?: string;
};

const ROUTE_ACCESS_CONFIG: RouteConfig[] = [
  { path: "/events", role_name: "Event Manager" },
  { path: "/event", role_name: "Event Manager" },
  { path: "/queries", role_name: "Event Manager" },
  { path: "/edit-event" },
  { path: "/ticket-scanning" },
];

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/",
  "/auth/forgot-password",
  "/auth/onboarding",
  "/auth/accept-invitation",
  "/auth/reset-password",
  "/reset-password",
  "/dashboard",
];

const isPublicRoute = (path: string) => PUBLIC_ROUTES.includes(path);

const AccessProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const params = useParams();
  const checkAccess = useCheckRouteAccess();
  const router = useRouter();
  const organizationId = useSelector(selectOrganizationId);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check route access and set authorization state
  const checkRouteAccess = async () => {
    setLoading(true);
    console.log("[Access-Provider] params: ", params);
    // Skip access check for public routes
    console.log("pathname: ",pathname)
    if (isPublicRoute(pathname)) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    // Find matching route config
    const route = ROUTE_ACCESS_CONFIG.find((config) =>
      pathname?.startsWith(config.path)
    );

    console.log("[Access-Provider] route: ", route);
    const id = params?.id;
    // Check access based on route configuration
    const hasAccess = route
      ? checkAccess(
          pathname,
          organizationId,
          route.role_name || null,
          Array.isArray(id) ? id[0] : id
        )
      : checkAccess(pathname, organizationId);

    setAuthorized(hasAccess);
    setLoading(false);
  };

  useEffect(() => {
    checkRouteAccess();
  }, [pathname, checkAccess, router, organizationId]);

  return (
    <>
      {!loading && authorized ? (
        <>{children}</>
      ) : (
        <BlurOverlay loading={true} />
      )}
    </>
  );
};

const BlurOverlay = ({ loading }: { loading: boolean }) => (
  <div
    className={`inset-0 min-h-[calc(100vh-20rem)] backdrop-blur-sm transition-opacity duration-300 ${
      loading ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-white/30 rounded-lg p-4 animate-pulsee">
          <div className="h-6 bg-gray-200/50 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200/50 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200/50 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200/50 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  </div>
);

export default AccessProvider;
