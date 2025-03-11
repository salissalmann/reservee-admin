import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";
import { useGetOrganizationById } from "./useGetOrganizationById";
import { useOrganization } from "./useCheckOrganization";
import { useAuth } from "@/app/_providers/initial-load";

interface ValidationState {
  isLoading: boolean;
  loadingState: {
    title: string;
    description: string;
  } | null;
  organization: any;
  error: boolean;
}

export const useOrganizationValidation = () => {
  const router = useRouter();
  const organizationId = useSelector(selectOrganizationId);
  const { loading: orgLoading, organizations } = useOrganization();
  const { organizations: invitedOrganizations } = useAuth();
  const {
    loading: orgDetailsLoading,
    organization,
    getOrganizationById,
  } = useGetOrganizationById(organizationId || "");

  // Debug logs
  console.log("Current State:", {
    organizationId,
    orgLoading,
    orgDetailsLoading,
    hasOrganizations: !!organizations,
    hasInvitedOrgs: !!invitedOrganizations,
    organization,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchOrgDetails = async () => {
      if (!organizationId) {
        console.log("No organizationId in effect");
        return;
      }

      // Check in both regular and invited organizations
      const orgExistsInRegular = organizations?.some(
        (org) => org?.id?.toString() === organizationId?.toString()
      );
      const orgExistsInInvited = invitedOrganizations?.some(
        (org) => org?.organization_id?.toString() === organizationId?.toString()
      );

      console.log("Organization existence check:", {
        orgExistsInRegular,
        orgExistsInInvited,
        organizationId,
      });

      if (!orgExistsInRegular && !orgExistsInInvited) {
        console.log("Organization not found in either list");
        return;
      }

      if (!organization && isMounted) {
        console.log("Fetching organization details for:", organizationId);
        await getOrganizationById(organizationId);
      }
    };

    fetchOrgDetails();
    return () => {
      isMounted = false;
    };
  }, [
    organizationId,
    organizations,
    invitedOrganizations,
    organization?.id,
    getOrganizationById,
  ]);

  const validateOrganization = (): ValidationState => {
    // Check if organizationId exists
    if (!organizationId) {
      console.log(
        "No organizationId found, redirecting to select organization"
      );
      router.push("/select-organization");
      return {
        isLoading: true,
        loadingState: {
          title: "Redirecting...",
          description: "Taking you to organization selection",
        },
        organization: null,
        error: true,
      };
    }

    // Check if any data is still loading
    if (orgLoading || orgDetailsLoading) {
      console.log("Loading state check:", { orgLoading, orgDetailsLoading });
      return {
        isLoading: true,
        loadingState: {
          title: "Loading Organization...",
          description: "Please wait while we load your organization data",
        },
        organization: null,
        error: false,
      };
    }

    // Now that loading is complete, check if we have the lists
    if (!organizations && !invitedOrganizations) {
      // console.log("No organization lists available");
      return {
        isLoading: true,
        loadingState: {
          title: "Loading Organizations...",
          description: "Retrieving your organization list",
        },
        organization: null,
        error: false,
      };
    }

    // Check if organization exists in either list
    const orgExistsInRegular = organizations?.some(
      (org) => org?.id?.toString() === organizationId?.toString()
    );
    const orgExistsInInvited = invitedOrganizations?.some(
      (org) => org?.organization_id?.toString() === organizationId?.toString()
    );

    console.log("Validation check:", {
      orgExistsInRegular,
      orgExistsInInvited,
      organizationId,
      orgDetailsLoading,
    });

    // If organization doesn't exist in either list after loading is complete
    if (!orgExistsInRegular && !orgExistsInInvited) {
      console.log("Organization not found in any organizations list");
      router.push("/select-organization");
      return {
        isLoading: true,
        loadingState: {
          title: "Invalid Organization",
          description: "Redirecting to organization selection",
        },
        organization: null,
        error: true,
      };
    }

    // At this point, we know:
    // 1. We're not loading
    // 2. We have organization lists
    // 3. The organization exists in one of the lists
    // So if we don't have organization details, something went wrong
    if (!organization) {
      console.log("Organization details missing after all checks");
      return {
        isLoading: true,
        loadingState: {
          title: "Loading Organization Details...",
          description: "Retrieving organization information",
        },
        organization: null,
        error: false,
      };
    }

    // All validations passed
    return {
      isLoading: false,
      loadingState: null,
      organization,
      error: false,
    };
  };

  return validateOrganization();
};
