"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Button from "@/app/_components/_layout-components/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Search, Plus } from "lucide-react";
import { OrganizationData } from "@/app/_types/organization-types";
import OrganizationCard from "./organization-card";
import { InvitedOrganizationData } from "@/app/_types/organization-types";

interface SelectOrganizationContainerProps {
  organizations: OrganizationData[];
  title: string;
  description: string;
  defaultlayout: boolean;
  invitedOrganizations?: InvitedOrganizationData[] | [];
}

const SelectOrganizationContainer = ({
  organizations,
  title,
  description,
  defaultlayout = true,
  invitedOrganizations = [],
}: SelectOrganizationContainerProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOrganizations = organizations.filter((org) =>
    org?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );
  const allOrganizations = invitedOrganizations?.filter((org) =>
    org?.organization_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div
      className={`${
        defaultlayout
          ? "min-h-screen p-2 space-y-4 w-full md:w-[90%] width-change  mx-auto"
          : "p-2 space-y-4 w-full"
      }`}
    >
      <div className="flex flex-col gap-8 items-center justify-center">
        <h1 className="text-3xl font-extrabold  md:mb-0">{title}</h1>
        <div className="relative flex-grow">
          <Input
            className="w-full  md:w-[600px] pl-12 h-11 rounded-full border-gray-200 dark:border-borderDark"
            placeholder="Search organizations by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-1 top-1 p-2 text-muted-foreground bg-primary rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <p className="md:text-lg text-center text-sm text-gray-500 dark:text-gray-300 font-semibold mt-4">
        {description}
      </p>
      <div
        className={`${
          allOrganizations?.length > 0
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "grid gap-6 md:grid-cols-1 lg:grid-cols-1"
        }`}
      >
        <Card className={`flex  mx-auto  min-h-fit items-center justify-center bg-gray-50 border-2 border-dashed shadow-none border-gray-500 dark:bg-tertiary dark:border-borderDark !mt-10 ${ allOrganizations?.length === 0 ? "max-w-lg":"w-full"}`}>
          <CardContent className=" py-8 text-center  flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center">
              <Building2 className="w-10 h-10 text-blue-500" />
            </div>
            <p className="mb-4 text-muted-foreground">
              Don’t see your organization? Add a new one.
            </p>
            <div className="flex justify-center">
              <Button
                btnStyle="rounded-fill"
                btnCover="primary-button"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => router.push("/create-organization")}
              >
                Create New Organization
              </Button>
            </div>
          </CardContent>
        </Card>

        {allOrganizations?.map((item: InvitedOrganizationData) => {
          const org = {
            id: item?.organization_id,
            name: item?.organization_name || "",
            logo: item?.organization_logo || "",
            description: item?.organization_name || "",
            logoFile: null,
            categories: [],
          };
          return (
            <OrganizationCard org={org} isInvitedOrganization={item?.invited} />
          );
        })}
        {filteredOrganizations.map((org: OrganizationData) => (
          <OrganizationCard org={org} />
        ))}
      </div>
    </div>
  );
};

export default SelectOrganizationContainer;
