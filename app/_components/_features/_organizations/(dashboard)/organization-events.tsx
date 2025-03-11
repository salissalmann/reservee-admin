import React from "react";
import { Loader, PlusIcon, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import toast from "react-hot-toast";
import { IEvent } from "@/app/_types/event-types";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";
import Button from "@/app/_components/_layout-components/button";
import LockOverlay from "@/app/_components/_layout-components/lock-overlay";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/initial-load";
import { useCheckRouteAccess } from "@/app/_utils/check-route-access";

const OrganizationEvents = ({ organizationId }: { organizationId: string }) => {
  const { organizations: allOrganizations } = useAuth();
  const [events, setEvents] = React.useState<IEvent[]>([]);
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  const getEvents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `${rootPath}/get-events-by-org-id/${organizationId}`
      );
      if (response.data.statusCode === 200) {
        let eventsData = response.data.data;

        // Check if user is invited and has specific event access
        const selectedOrg = getSelectedOrganization();
        if (selectedOrg?.invited && selectedOrg?.event_id) {
          // Filter to show only the event they have access to
          eventsData = eventsData.filter(
            (event: IEvent) => event.id === selectedOrg.event_id
          );
        }

        const sortedEvents = eventsData.sort((a: IEvent, b: IEvent) => {
          const dateA = a.date_times[0].date
            ? new Date(a.date_times[0].date).getTime()
            : 0;
          const dateB = b.date_times[0].date
            ? new Date(b.date_times[0].date).getTime()
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
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getEvents();
  }, []);

  const getSelectedOrganization = () => {
    return allOrganizations?.find(
      (org) => org?.organization_id === organizationId
    );
  };

  const hasTeamManagementAccess = () => {
    const selectedOrg = getSelectedOrganization();

    if (!selectedOrg) {
      return false;
    }

    // Allow access if not invited
    if (!selectedOrg.invited) {
      return true;
    }

    // Allow access if user has Team Management module or specific route access
    const hasTeamManagement = selectedOrg?.modules?.some(
      (module) =>
        module?.name === "Team Management" ||
        module?.front_end_routes?.some((route) =>
          ["/create-team-member", "/team-members"]?.includes(route)
        )
    );

    return hasTeamManagement;
  };

  const isLocked = !hasTeamManagementAccess();

  return (
    <>
      <LockOverlay
        isLocked={isLocked}
        message="Access Restricted: You don't have permission to view or manage events"
        className="border-2 border-red-200 dark:border-tertiary rounded-lg"
      >
        <Card className="bg-[#F6F6F6] dark:bg-tertiary rounded-lg shadow-sm h-full border dark:border-borderDark border-gray-100">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-6 justify-between md:mb-6">
              <div className="flex items-center gap-2 ">
                <Calendar />
                <h2 className="text-xl font-bold">Your Events</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  className="w-fit bg-tertiary dark:bg-white dark:text-tertiary dark:border-borderDark dark:border-tertiary hover:bg-white hover:text-tertiary hover:border-tertiary hover:dark:bg-tertiary hover:dark:text-white hover:dark:border-tertiary"
                  btnStyle="rounded-fill"
                  btnCover="primary-button"
                  icon={<PlusIcon className="h-4 w-4" />}
                  onClick={() => {
                    router.push("/create-event");
                  }}
                >
                  Create New Event
                </Button>
              </div>
            </div>

            {loading && (
              <div className="flex justify-center items-center min-h-[20rem] shadow-xl">
                <div className="flex flex-row flex-wrap justify-center items-center gap-4">
                  <Loader className="w-5 h-5 animate-spin dark:text-gray-300" />
                  <p className="text-md text-gray-500 dark:text-gray-300">
                    Loading events...
                  </p>
                </div>
              </div>
            )}
            {!loading && events?.length === 0 ? (
              <div className="flex justify-center items-center min-h-[20rem] shadow-xl">
                <h1 className="text-lg text-gray-500 dark:text-gray-300">
                  No events found
                </h1>
              </div>
            ) : (
              <>
                <EventCards events={events?.slice(0, 3)} />
                {events?.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      className="w-full md:w-fit bg-white border-tertiary text-tertiary hover:bg-tertiary hover:text-white"
                      btnStyle="rounded-fill"
                      btnCover="primary-button"
                      onClick={() => router.push(`/events/${organizationId}`)}
                    >
                      View All Events
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </LockOverlay>
    </>
  );
};

const EventCards = ({ events }: { events: IEvent[] }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event?.id} event={event} />
      ))}
    </div>
  );
};

const EventCard = ({ event }: { event: IEvent }) => {
  const checkRouteAccess = useCheckRouteAccess();
  const router = useRouter();

  return (
    <div
      className="p-4 bg-white border-2 border-[#E8E8E8] dark:bg-tertiary dark:border-borderDark rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => {
          // if (checkRouteAccess("/edit-event")) {
        //   router.push(`/edit-event/${event?.id}`);
        // }
        if (checkRouteAccess("/view-event", null, "Event Manager", event.id)) {
          router.push(`/event/${event.id}`);
        }
      }}
    >
      <h2 className="text-tertiary dark:text-gray-300 font-semibold">
        {event.event_title}
      </h2>
      {event?.event_desc && (
        <p
          className="text-md text-gray-500 dark:text-gray-300"
          dangerouslySetInnerHTML={{
            __html: event?.event_desc?.substring(0, 200) + "...",
          }}
        ></p>
      )}
    </div>
  );
};

export default OrganizationEvents;
