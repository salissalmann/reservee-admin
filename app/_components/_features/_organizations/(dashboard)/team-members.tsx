import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Button from "@/app/_components/_layout-components/button";
import { useTeamInvitations } from "@/app/_hooks/_organizations/useTeamInvitations";
import { Avatar } from "antd";
import { useCheckRouteAccess } from "@/app/_utils/check-route-access";
import { Loader2, Plus, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

interface TeamMembersProps {
  org_id: string;
  event_id?: string;
}

export default function TeamMembers({ org_id, event_id }: TeamMembersProps) {
  const router = useRouter();
  const checkRouteAccess = useCheckRouteAccess();

  const { invites, isLoading, error } = useTeamInvitations({
    org_id,
    event_id,
    page: 1,
    limit: 10,
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-full dark:bg-tertiary border dark:border-borderDark border-gray-100 bg-[#F6F6F6] rounded">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </div>
      ) : (
        <>
          {error ? (
            <div className="flex justify-center items-center h-full dark:bg-tertiary border dark:border-borderDark border-gray-100 bg-[#F6F6F6] rounded">
              <p className="text-red-500">Error loading team members</p>
            </div>
          ) : (
            <Card className="dark:bg-tertiary border dark:border-borderDark border-gray-100 bg-[#F6F6F6]">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                   <UsersRound className="text-primary"/>
                  <h2 className="text-xl font-bold">Team Members</h2>
                </div>

                <div className="space-y-4 ">
                  <Tabs
                    defaultValue="accepted"
                    className="w-full dark:text-gray-300"
                  >
                    <TabsList className="grid w-full md:grid-cols-2">
                      <TabsTrigger value="accepted">
                        Accepted Members
                      </TabsTrigger>
                      <TabsTrigger value="pending">Pending Invites</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="accepted"
                      className="mt-4 dark:text-gray-300"
                    >
                      {invites?.filter(
                        (invite) => invite?.invitation_status === "Accepted"
                      ).length > 0 ? (
                        invites
                          ?.filter(
                            (invite) => invite?.invitation_status === "Accepted"
                          )
                          .map((invite: any) => (
                            <div
                              key={invite?.id}
                              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-borderDark mb-2"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar size={40} shape="circle">
                                  {invite?.email[0].toUpperCase()}
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">
                                    {invite?.email}
                                  </h3>
                                  {invite?.modules &&
                                    invite?.modules.length > 0 && (
                                      <p className="text-sm text-muted-foreground">
                                        {invite?.modules
                                          ?.map(
                                            (module: any) => module.module_name
                                          )
                                          .join(", ")}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-500">
                            No accepted team members yet
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="pending" className="mt-4">
                      {invites?.filter(
                        (invite) => invite?.invitation_status !== "Accepted"
                      ).length > 0 ? (
                        invites
                          ?.filter(
                            (invite) => invite?.invitation_status !== "Accepted"
                          )
                          .map((invite: any) => (
                            <div
                              key={invite?.id}
                              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-borderDark mb-2"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar size={40} shape="circle">
                                  {invite?.email[0].toUpperCase()}
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">
                                    {invite?.email}
                                  </h3>
                                  <p className="text-sm text-yellow-500">
                                    Pending
                                  </p>
                                  {invite?.modules &&
                                    invite?.modules.length > 0 && (
                                      <p className="text-sm text-muted-foreground">
                                        {invite?.modules
                                          ?.map(
                                            (module: any) => module?.module_name
                                          )
                                          .join(", ")}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-500">
                            No pending invitations
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex justify-center">
                  <Button
                    btnStyle="rounded-fill"
                    btnCover="primary-button"
                    icon={<Plus className="w-4 h-4 mr-2" />}
                    onClick={() => {
                      if (checkRouteAccess("/create-team-member")) {
                        const queryParams = event_id 
                          ? `?event_id=${event_id}` 
                          : '';
                        router.push(`/create-team-member${queryParams}`);
                      }
                    }}
                  >
                    Add Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
}
