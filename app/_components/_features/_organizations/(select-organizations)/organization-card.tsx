import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/_utils/redux/store";
import { selectOrganization } from "@/app/_utils/redux/organizationSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { PenSquare } from "lucide-react";
import Button from "@/app/_components/_layout-components/button";
import { OrganizationData } from "@/app/_types/organization-types";
import store from "@/app/_utils/redux/store";

const OrganizationCard = ({
  org,
  isInvitedOrganization = false,
}: {
  org: OrganizationData;
  isInvitedOrganization?: boolean;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSelectOrganization = useCallback(() => {
    if (org && org?.id) {
      const action = dispatch(selectOrganization(org?.id));
      const currentState = store.getState();
      router.push(`/dashboard`);
    }
  }, [org, dispatch, router]);

  return (
    <>
      <Card
        key={org?.id}
        className="bg-white shadow-none dark:bg-tertiary border dark:border-borderDark border-gray-400 !mt-10"
      >
        <CardContent className="p-6 space-y-5 flex flex-col justify-between h-full">
          {isInvitedOrganization ? (
            <div className="mb-4 flex gap-3 items-center  bg-muted dark:bg-tertiary dark:border dark:border-borderDark p-2 rounded-md justify-center w-fit mx-auto">
              <div className="flex items-center justify-center rounded">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-sm text-tertiary dark:text-gray-300">
                Invited Organization
              </span>
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-2 bg-muted dark:bg-tertiary dark:border dark:border-borderDark p-2 rounded-md justify-center w-fit mx-auto">
              <div className="flex items-center justify-center rounded ">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-sm text-tertiary dark:text-gray-300">
                Organization {org?.id}
              </span>
            </div>
          )}
          <div className="mb-6 flex flex-col items-center gap-3">
            {org?.logo && org?.logo?.trim() !== "" ? (
              <Image
                src={org?.logo}
                alt={org?.name}
                width={64}
                height={64}
                className="object-cover w-16 h-16 border border-gray-200 dark:border-borderDark rounded-lg p-2"
              />
            ) : (
              <div className="w-16 h-16 bg-muted dark:bg-borderDark rounded-lg p-2"></div>
            )}

            <h2 className="text-2xl font-bold text-tertiary dark:text-gray-300">{org?.name}</h2>
          </div>

          <div className="flex items-center justify-center gap-3 mt-auto">
            <Button
              className="w-fit bg-tertiary border-tertiary dark:bg-white dark:border-borderDark dark:text-tertiary hover:bg-white hover:text-tertiary hover:border-tertiary"
              btnStyle="rounded-fill"
              btnCover="primary-button"
              icon={<PenSquare className="h-4 w-4" />}
              onClick={handleSelectOrganization}
            >
              Select Organization
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrganizationCard;
