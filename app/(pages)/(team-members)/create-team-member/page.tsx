"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";
  ;
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { GetRolesAPI } from "@/app/_apis/roles-api";
import { GetRoleModulesByRoleIdAPI } from "@/app/_apis/roles-module-api";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import { useOrganization } from "@/app/_hooks/_organizations/useCheckOrganization";
import {
  SendTeamInvitationAPI,
  TeamInvitationPayload,
} from "@/app/_apis/team-invitation-api";
import InviteeProgress from "./invitee-progress";
import { IEvent } from "@/app/_types/event-types";
import { GetEventByOrganizationId } from "@/app/_apis/event-apis";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";

interface IRoleModule {
  id?: number;
  role_id?: number | null;
  name: string;
  description: string;
  front_end_route: string;
  backend_routes: string[];
}

interface IRole {
  id: string;
  name: string;
  description: string;
}

export default function CreateTeamMember() {
  const router = useRouter();
  const organizationId = useSelector(selectOrganizationId);

  // State Management
  // Core Form State
  const [state, setState] = useState({
    loading: false,
    email: "",
    selectedRole: "",
    selectedRoleName: "",
    selectedModules: [] as number[],
    selectedOrganization: "",
    selectedEvent: "",
  });

  // New state to track if event and role are pre-filled from query
  const [isPrefilledFromQuery, setIsPrefilledFromQuery] = useState({
    role: false,
    event: false,
  });

  // Loading States
  const [moduleLoading, setModuleLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organization State
  const { loading: organizationLoading, organizations } = useOrganization();
  const [organizationFromThunk, setOrganizationFromThunk] = useState<{
    id?: string;
    name?: string;
  } | null>(null);

  // Data Fetching States
  const [availableRoles, setAvailableRoles] = useState<IRole[]>([]);
  const [roleModulesByRole, setRoleModulesByRole] = useState<IRoleModule[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);

  // Memoized Current Organization
  const currentOrganization = useMemo(
    () => organizations?.[0] ?? null,
    [organizations]
  );

  // =============== EFFECTS ===============

  // Effect: Check and Set Organization from Thunk
  useEffect(() => {
    const checkOrganizationInThunk = async () => {
      try {
        if (organizationId) {
          // Find matching organization
          const matchedOrg = organizations?.find(
            (org) => String(org.id) === String(organizationId)
          );

          if (matchedOrg) {
            // Set organization in state
            setState((prev) => ({
              ...prev,
              selectedOrganization: String(matchedOrg.id),
            }));
            setOrganizationFromThunk({
              id: String(matchedOrg.id),
              name: matchedOrg.name,
            });
          } else {
            // If no matching org found, redirect to organization selection
            toast.error("Please select an organization first.");
          }
        }
      } catch (error) {
        console.error("Error checking organization:", error);
        toast.error("Error loading organization details.");
      }
    };

    if (organizations && organizations.length > 0) {
      checkOrganizationInThunk();
    }
  }, [organizations, organizationId]);

  // Effect: Fetch Events for Selected Organization
  useEffect(() => {
    if (
      state &&
      state?.selectedOrganization &&
      state?.selectedOrganization?.trim()?.length > 0
    ) {
      const organizationId = state?.selectedOrganization;
      getEvents(organizationId);
    }
  }, [state?.selectedOrganization]);

  // Effect: Fetch Roles on Component Mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await GetRolesAPI();
        if (response?.statusCode === 200) {
          setAvailableRoles(response?.data ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch roles", error);
        toast.error("Could not load roles");
      }
    };

    fetchRoles();
  }, []);

  // Effect: Check and Handle Event ID from Query Parameters
  useEffect(() => {
    const handleEventIdFromQuery = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const eventIdFromQuery = searchParams.get("event_id");

      if (eventIdFromQuery && state.selectedOrganization) {
        try {
          // Find the event with the given ID
          const matchedEvent = events.find(
            (event) => String(event.id) === eventIdFromQuery
          );

          if (matchedEvent) {
            // Find the Event Manager role
            const eventManagerRole = availableRoles.find(
              (role) => role.name === "Event Manager"
            );

            if (eventManagerRole) {
              // Update state to pre-fill Event Manager role and selected event
              setState((prev) => ({
                ...prev,
                selectedRole: eventManagerRole.id,
                selectedRoleName: "Event Manager",
                selectedEvent: String(matchedEvent.id),
              }));

              // Set pre-filled flags
              setIsPrefilledFromQuery({
                role: true,
                event: true,
              });

              // Fetch role modules for Event Manager role
              await fetchRoleModulesByRole(Number(eventManagerRole.id));
            }
          }
        } catch (error) {
          console.error("Error handling event ID from query:", error);
        }
      }
    };

    if (
      events.length > 0 &&
      availableRoles.length > 0 &&
      state.selectedOrganization
    ) {
      handleEventIdFromQuery();
    }
  }, [events, availableRoles, state.selectedOrganization]);

  // =============== EVENT HANDLERS ===============

  // Handler: Fetch Events for Organization
  const getEvents = async (id: string) => {
    try {
      setEventsLoading(true);
      const response = await GetEventByOrganizationId(id);
      if (response?.statusCode === 200) {
        const sortedEvents = response?.data.sort((a: IEvent, b: IEvent) => {
          const dateA = a?.date_times[0].date
            ? new Date(a?.date_times[0]?.date)?.getTime()
            : 0;
          const dateB = b?.date_times[0]?.date
            ? new Date(b?.date_times[0]?.date)?.getTime()
            : 0;
          return dateA - dateB;
        });
        setEvents(sortedEvents);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      axiosErrorHandler(error, "Error fetching events");
    } finally {
      setEventsLoading(false);
    }
  };

  // Handler: Role Change and Module Fetching
  const handleRoleChange = (roleId: string) => {
    const selectedRole = availableRoles.find((role) => role.id === roleId);
    setState((prev) => ({
      ...prev,
      selectedRole: roleId,
      selectedRoleName: selectedRole?.name || "",
      selectedEvent: "",
    }));
    fetchRoleModulesByRole(Number(roleId));
  };

  // Handler: Fetch Role Modules
  const fetchRoleModulesByRole = async (roleId: number) => {
    try {
      setModuleLoading(true);
      setState((prev) => ({ ...prev, loading: true }));
      const response = await GetRoleModulesByRoleIdAPI(roleId);

      if (response?.statusCode === 200) {
        setRoleModulesByRole(response?.data ?? []);
      }
    } catch (error) {
      axiosErrorHandler(error, "Error fetching role modules");
    } finally {
      setModuleLoading(false);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handler: Toggle Module Selection
  const handleModuleToggle = (moduleId: number) => {
    setState((prev) => {
      const currentModules = prev.selectedModules;
      const isAlreadySelected = currentModules.includes(moduleId);

      if (isAlreadySelected) {
        // Remove module if already selected
        return {
          ...prev,
          selectedModules: currentModules.filter(
            (module) => module !== moduleId
          ),
        };
      } else {
        // Add module if not selected
        return {
          ...prev,
          selectedModules: [...currentModules, moduleId],
        };
      }
    });
  };

  // =============== SUBMISSION HANDLER ===============

  // Handler: Submit Team Member Invite
  const handleSubmitInvites = async () => {
    // Validate current organization
    if (!state?.selectedOrganization) {
      toast.error("No organization selected. Please choose an organization.");
      return;
    }

    // Validate form fields
    const {
      email,
      selectedRole,
      selectedModules,
      selectedOrganization,
      selectedEvent,
    } = state;

    // Comprehensive Form Validation
    const validationErrors = [
      !email && "Email is required",
      !selectedRole && "Role selection is required",
      !selectedModules.length && "At least one module must be selected",
      !selectedOrganization && "Organization selection is required",
      state?.selectedRoleName === "Event Manager" &&
        !selectedEvent &&
        "Event selection is required for this role",
    ].filter(Boolean);

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0] as string);
      return;
    }

    // Set loading state
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Find module IDs for the selected modules
      const moduleIds = selectedModules
        .map(
          (selectedModuleId) =>
            roleModulesByRole?.find((module) => module?.id === selectedModuleId)
              ?.id
        )
        .filter((id): id is number => id !== undefined);

      // Validate module IDs
      if (!moduleIds?.length) {
        throw new Error(
          `No module IDs found for selected modules: ${selectedModules.join(
            ", "
          )}`
        );
      }

      // Prepare invite payload
      const invite: TeamInvitationPayload = {
        email,
        message:
          "We are excited to invite you to join our organization. Please accept the invitation to get started!",
        role_id: Number(selectedRole),
        org_id: Number(state?.selectedOrganization),
        event_id: null,
        modules: moduleIds,
      };

      if (selectedEvent) {
        invite.event_id = Number(selectedEvent);
      }

      // Send invitation
      const response = await SendTeamInvitationAPI(invite);

      // Check if invitation was successful
      if (response) {
        toast.success(`Invitation sent to ${email}`);

        // Reset form state after successful invitation
        setState((prev) => ({
          ...prev,
          email: "",
          // Preserve pre-filled role and event if they were from query
          selectedRole: isPrefilledFromQuery.role ? prev.selectedRole : "",
          selectedRoleName: isPrefilledFromQuery.role
            ? prev.selectedRoleName
            : "",
          selectedModules: [], // Reset to empty array
          selectedOrganization: isPrefilledFromQuery.event
            ? prev.selectedOrganization
            : "",
          selectedEvent: isPrefilledFromQuery.event ? prev.selectedEvent : "",
          loading: false,
        }));
      } else {
        throw new Error("Invitation response was empty");
      }
    } catch (error) {
      console.error("Invitation Error:", error);

      axiosErrorHandler(error, "Failed to send invitation");

      // Ensure loading state is reset
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
       
      <Toaster />
      <div className="w-full  mx-auto px-6 py-6 minn-h-[80vh] flex items-center justify-center min-h-[calc(100vh-20rem)] ">
        <div className="dark:bg-tertiary bg-white dark:text-white text-tertiary w-full max-w-7xl">
          <div className="mx-auto space-y-6">
            {/* Page Header */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="mb-6 lg:col-span-2">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Complete Your Vendor Setup
                </h1>
                <p className="text-muted-foreground dark:text-white">
                  Follow the steps below to start managing your organizations
                  and events.
                </p>
              </div>

              {/* Progress Indicator */}
              <Card className="border border-gray-200 bg-white dark:bg-tertiary dark:border-borderDark">
                <div className="p-6 space-y-2">
                  <p className="text-sm font-medium">
                    {/* Step 2 of 3: */}
                    Add Team Member
                  </p>
                  <Progress
                    value={66}
                    className="h-2 border border-gray-100 dark:border-borderDark"
                  />
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="dark:bg-tertiary bg-white col-span-2 border border-gray-200 dark:border-borderDark">
                <CardHeader>
                  <div className="flex flex-col items-center text-center justify-center gap-2 mb-6">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle className="text-3xl">
                      {/* Step 2.  */}
                      Add Team Member
                    </CardTitle>
                  </div>
                  <CardDescription className="text-center">
                    Invite team members to collaborate and manage your
                    organization effectively.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Team Member Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g., teammember@domain.com"
                      value={state?.email}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="rounded-full focus:outline-none focus:ring-0 border border-gray-300 dark:border-borderDark"
                    />
                  </div>

                  {/* Organization Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Organization{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={state?.selectedOrganization}
                      onValueChange={(value) =>
                        setState((prev) => ({
                          ...prev,
                          selectedOrganization: value,
                        }))
                      }
                      disabled={true}
                      // disabled={!!organizationFromThunk} // Disable if organization is from thunk
                    >
                      <SelectTrigger
                        className="rounded-full focus:outline-none focus:ring-0 border border-gray-300 dark:border-borderDark"
                        disabled={!!organizationFromThunk}
                      >
                        <SelectValue
                          placeholder={
                            organizationFromThunk
                              ? organizationFromThunk.name
                              : "Select an organization"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations?.map((org) => (
                          <SelectItem key={org.id} value={String(org.id)}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* {organizationFromThunk && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Organization automatically selected from your current
                        context
                      </p>
                    )} */}
                    <p className="text-xs text-muted-foreground">
                      Choose the organization for this team member.
                    </p>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Assign a role <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={state?.selectedRole}
                      onValueChange={handleRoleChange}
                      disabled={isPrefilledFromQuery.role}
                    >
                      <SelectTrigger
                        className="rounded-full focus:outline-none focus:ring-0 border border-gray-300 dark:border-borderDark"
                        disabled={isPrefilledFromQuery.role}
                      >
                        <SelectValue
                          placeholder={
                            isPrefilledFromQuery.role
                              ? state.selectedRoleName
                              : "Select an organization role"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles?.map((role) => (
                          <SelectItem key={role?.id} value={role?.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {isPrefilledFromQuery.role
                        ? "Role is pre-selected based on the event"
                        : "Choose the level of responsibility for this team member."}
                    </p>
                  </div>

                  {/* Module Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Assign Responsibilities (Modules){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid lg:grid-cols-2 gap-2">
                      {!state.selectedRole ? (
                        <div className="col-span-full text-center text-muted-foreground py-4 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            Please select a role to view available modules
                          </p>
                        </div>
                      ) : moduleLoading ? (
                        <div className="col-span-full flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2 text-muted-foreground">
                            Loading modules...
                          </span>
                        </div>
                      ) : roleModulesByRole?.length ? (
                        roleModulesByRole?.map((module) =>
                          module?.id !== undefined ? (
                            <div
                              key={module.id}
                              className={`
                                flex items-center p-2 border rounded-lg cursor-pointer
                                ${
                                  state?.selectedModules?.includes(module?.id)
                                    ? "bg-primary/10 border-primary"
                                    : "border-gray-200 dark:border-borderDark"
                                }
                              `}
                              onClick={() => {
                                if (module?.id !== undefined) {
                                  handleModuleToggle(module.id);
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                id={`module-${module.id}`}
                                checked={state?.selectedModules?.includes(
                                  module.id
                                )}
                                onChange={() => {}}
                                className="mr-2 accent-primary"
                              />
                              <label
                                htmlFor={`module-${module.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {module.name}
                              </label>
                            </div>
                          ) : null
                        )
                      ) : (
                        <div className="col-span-full text-center text-muted-foreground py-4 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            No modules available for the selected role
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select the specific areas this team member will manage.
                    </p>
                  </div>

                  {/* Event Selection */}
                  {state?.selectedRoleName === "Event Manager" ? (
                    eventsLoading ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Select Event <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2 text-muted-foreground">
                            Loading events...
                          </span>
                        </div>
                      </div>
                    ) : events?.length > 0 ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Select Event <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={state?.selectedEvent}
                          onValueChange={(value) =>
                            setState((prev) => ({
                              ...prev,
                              selectedEvent: value,
                            }))
                          }
                          disabled={isPrefilledFromQuery.event}
                        >
                          <SelectTrigger
                            className="rounded-full focus:outline-none focus:ring-0 border border-gray-300 dark:border-borderDark"
                            disabled={isPrefilledFromQuery.event}
                          >
                            <SelectValue
                              placeholder={
                                isPrefilledFromQuery.event
                                  ? events.find(
                                      (e) =>
                                        String(e.id) === state.selectedEvent
                                    )?.event_title
                                  : "Select an event"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {events?.map((event) => (
                              <SelectItem
                                key={event?.id}
                                value={String(event?.id)}
                              >
                                {event?.event_title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {isPrefilledFromQuery.event
                            ? "Event is pre-selected based on the query"
                            : "Choose the event for this team member."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Select Event <span className="text-red-500">*</span>
                        </label>
                        <div className="text-center text-muted-foreground py-4 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            No events found for this organization
                          </p>
                        </div>
                      </div>
                    )
                  ) : null}

                  {/* Submit Invites Button */}
                  <Button
                    onClick={handleSubmitInvites}
                    variant="default"
                    size="lg"
                    className="bg-primary text-white rounded-full w-full"
                    disabled={
                      !state?.email ||
                      !state?.selectedRole ||
                      !state.selectedModules.length ||
                      !state?.selectedOrganization ||
                      state.loading
                    }
                  >
                    {state?.loading ? "Sending Invitation" : "Send Invitation"}
                  </Button>
                </CardContent>
              </Card>
              <InviteeProgress />
            </div>
          </div>
        </div>
      </div>
       
    </>
  );
}
