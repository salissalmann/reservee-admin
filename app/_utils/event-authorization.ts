import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";
import { useAuth } from "../_providers/initial-load";

export const checkEventEditAuthorization = (
  eventId: string,
  user: any,
  onAuthorized?: (data: any) => void
) => {
  const auth = useAuth();
  const organizations = auth?.organizations;

  // If no user or organizations, deny access
  if (!user || !organizations || organizations.length === 0) {
    toast.error("Insufficient information to determine access");
    return false;
  }

  // Super Admin always has full access
  if (user.role === "Super Admin") {
    onAuthorized?.({ eventId, user });
    return true;
  }

  // Get the current selected organization ID from Redux
  const selectedOrganizationId = useSelector(selectOrganizationId);

  // Find the organization with the selected ID
  const selectedOrganization = organizations.find(
    (org) => org.organization_id === selectedOrganizationId
  );

  // If no organization is selected or found, deny access
  if (!selectedOrganization) {
    toast.error("No organization selected");
    return false;
  }

  // Check if the event is associated with the selected organization
  const hasEventAccess =
    selectedOrganization.event_id?.toString() === eventId.toString();

  if (!hasEventAccess) {
    toast.error("You do not have access to this event");
    return false;
  }

  // Check for specific event edit permissions
  const eventModules = selectedOrganization.modules || [];
  const hasEventEditPermission = eventModules.some(
    (module: any) =>
      module.name === "Event Management" &&
      module.front_end_routes?.includes("/edit-event")
  );

  if (!hasEventEditPermission) {
    toast.error("You do not have permission to edit events");
    return false;
  }

  // If all checks pass, return true
  onAuthorized?.({ eventId, user });
  return true;
};
