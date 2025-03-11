"use client";
import { OrganizationData } from "@/app/_types/organization-types";
import { useRouter } from "next/navigation";
import OrganizationEvents from "@/app/_components/_features/_organizations/(dashboard)/organization-events";
import RevenueSection from "@/app/_components/_features/_organizations/(dashboard)/revenue-section";
import TeamMembers from "@/app/_components/_features/_organizations/(dashboard)/team-members";
import OrganizationOverview from "../(dashboard)/organization-overview";
import { GetOrganizationAnalyticsAPI } from "@/app/_apis/organization-apis";
import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";

interface OrganizationViewProps {
  organization: OrganizationData;
  title: string;
  description: string;
}

const OrganizationView = ({
  organization,
  title,
  description,
}: OrganizationViewProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const analytics = await GetOrganizationAnalyticsAPI(organization?.id || "");
      if (analytics.status === true) {
        setAnalytics(analytics.data);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [organization.id]);


  return (
    <div className="min-h-screen p-2 space-y-4 w-full md:w-[90%] width-change  mx-auto bg-white dark:bg-tertiary">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-tertiary dark:text-gray-300">{title}</h1>
        <p className="text-gray-500 text-md dark:text-gray-300">{description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 ">
        <OrganizationOverview organization={organization} analytics={analytics} loading={loading}/>
        <OrganizationEvents organizationId={organization?.id || ""} />
        <RevenueSection analytics={analytics} loading={loading}/>
        <TeamMembers org_id={organization?.id || ""} />
      </div>
    </div>
  );
};

export default OrganizationView;
