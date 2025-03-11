"use client";
import SelectOrganizationContainer from "@/app/_components/_features/_organizations/(select-organizations)/organization-selection";
import { useAuth } from "@/app/_providers/initial-load";

export default function OrganizationSetup() {
  const { organizations: invitedOrganizations } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-tertiary p-4 md:p-8">
      <div className="w-full md:w-[90%] width-change  mx-auto space-y-8">
        <SelectOrganizationContainer
          organizations={[]}
          title="Select an Organization to Continue"
          description="Choose one of your organizations below to proceed to the dashboard. You can switch organizations later if needed."
          defaultlayout={false}
          invitedOrganizations={invitedOrganizations}
        />
      </div>
    </div>
  );
}
