"use client";

import { useAuth } from "@/app/_providers/initial-load";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";
import { useErrorModalStore } from "@/app/_store/error-modal-store";

interface Module {
  id: number;
  name: string;
  front_end_routes?: string[];
}

interface InvitedOrganizationData {
  organization_id: number | null;
  organization_name: string | null;
  organization_logo: string | null;
  role_name: string | null;
  modules?: Module[];
  event_id: number | null;
  event_name: string | null;
  invited: boolean;
}

// Public routes that don't need validation
export const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/accept-invitation",
  "/select-organization",
  "/reset-password",
  "/seatmap",
  "/buy-tickets",
  "/dashboard",
];

export const useCheckRouteAccess = () => {
  const auth = useAuth();
  const reduxOrganizationId = useSelector(selectOrganizationId);
  const showError = useErrorModalStore((state) => state.showError);

  return (
    currentRoute: string,
    organizationId?: string | number | null,
    role_name?: string | null,
    event_id?: string | number | null
  ): boolean => {
    // Check if it's a public route first
    if (PUBLIC_ROUTES?.some((route) => currentRoute?.startsWith(route))) {
      return true;
    }

    // If organizationId is not provided, use the one from Redux
    const effectiveOrganizationId = organizationId || reduxOrganizationId;

    const allOrganizations = auth?.organizations;

    // If no organizations array provided
    if (
      !allOrganizations ||
      !Array.isArray(allOrganizations || !effectiveOrganizationId)
    ) {
      showError?.(
        "Access Denied",
        "No organizations found. Please make sure you're properly logged in."
      );
      return false;
    }

    const getSelectedOrganization = () => {
      return allOrganizations?.find(
        (org) => org?.organization_id === effectiveOrganizationId
      );
    };

    // Find the selected organization
    const selectedOrg = getSelectedOrganization();

    // If no organization is selected, deny access
    if (!selectedOrg) {
      showError(
        "Organization Not Found",
        "The selected organization was not found in your account."
      );
      return false;
    }

    // If user is invited, allow access to all routes
    if (!selectedOrg?.invited) {
      // console.log("User is not invited");

      return true;
    }

    // If no modules exist, deny access
    if (!selectedOrg?.modules || selectedOrg?.modules?.length === 0) {
      showError(
        "No Modules Assigned",
        "You don't have any modules assigned to this organization. Please contact your administrator."
      );
      return false;
    }

    // Get all unique front_end_routes from all modules
    const allowedRoutes = new Set<string>();
    selectedOrg?.modules?.forEach((module) => {
      if (module?.front_end_routes && Array.isArray(module?.front_end_routes)) {
        module?.front_end_routes?.forEach((route) => allowedRoutes?.add(route));
      }
    });

    console.log(
      "Allowed Routes:",
      Array.from(allowedRoutes),
      currentRoute,
      role_name,
      event_id,
      selectedOrg
    );

    // If no routes found in any module, deny access
    if (allowedRoutes.size === 0) {
      showError(
        "No Route Permissions",
        "You don't have any route permissions assigned. Please contact your administrator."
      );
      return false;
    }

    if (currentRoute !== "/edit-event") {
      if (
        selectedOrg?.event_id?.toString() === event_id?.toString() &&
        selectedOrg?.role_name === role_name
      ) {
        return true;
      }
      if (currentRoute !== "/events") {
        if (
          // selectedOrg?.event_id?.toString() === event_id?.toString() &&
          selectedOrg?.role_name === role_name
        ) {
          return true;
        }
      }
    }

    // Check if the current route matches any of the allowed routes
    // Convert both to lowercase for case-insensitive comparison
    const normalizedCurrentRoute = currentRoute.toLowerCase();
    const hasAccess = Array.from(allowedRoutes).some((route) =>
      normalizedCurrentRoute.startsWith(route.toLowerCase())
    );

    if (!hasAccess) {
      showError(
        "Permission Denied",
        "You don't have permission to access this route. Please contact your administrator if you believe this is a mistake.",
        {
          canDismiss: false,
          redirectPath: "/dashboard",
        }
      );
      return false;
    }

    return true;
  };
};
