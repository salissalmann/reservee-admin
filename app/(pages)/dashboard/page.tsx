"use client";

import { useAuth } from "@/app/_providers/initial-load";
import OrganizationView from "@/app/_components/_features/_organizations/(select-organizations)/organization-overview";
import { useOrganizationValidation } from "@/app/_hooks/_organizations/useOrganizationValidation";
import { LoaderIcon } from "lucide-react";

// Types
interface LoadingScreenProps {
  title: string;
  description: string;
}

// Components
const LoadingScreen = ({ title, description }: LoadingScreenProps) => (
  <>
    <div className="pb-24 pt-10 dark:bg-tertiary bg-white dark:text-white p-6 min-h-[calc(100vh-20rem)] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <LoaderIcon className="text-black dark:text-white h-7 w-7 animate-spin" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  </>
);

const DashboardContent = ({ organization }: { organization: any }) => (
  <>
    <div className="pb-24 pt-10 dark:bg-tertiary bg-white dark:text-white p-6 min-h-[calc(100vh-20rem)]">
      <OrganizationView
        organization={organization}
        title="Dashboard"
        description="Manage your organization's overview, events, and team members"
      />
    </div>
  </>
);

export default function Dashboard() {
  const { isLoading, loadingState, organization } = useOrganizationValidation();

  if (isLoading && loadingState) {
    return (
      <LoadingScreen
        title={loadingState.title}
        description={loadingState.description}
      />
    );
  }

  return <DashboardContent organization={organization} />;
}
