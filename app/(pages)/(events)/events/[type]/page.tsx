"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ListIcon, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import Button from "@/app/_components/_layout-components/button";
import CreateEventCard from "../(components)/create-event-card";
import { useRouter } from "next/navigation";
import { IEvent } from "@/app/_types/event-types";
import { useOrganization } from "@/app/_hooks/_organizations/useCheckOrganization";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";
import Loader from "@/app/_components/_layout-components/loader";
import { toast } from "react-hot-toast";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import EventCards from "../(components)/event-card";
import { useSelector } from "react-redux";
import LockOverlay from "@/app/_components/_layout-components/lock-overlay";
import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";
import { useAuth } from "@/app/_providers/initial-load";

export const runtime = "edge";

export default function Component({ params }: { params: { type: string } }) {
  const { user, organizations: allOrganizations } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );
  const [viewType, setViewType] = React.useState("list");
  const [timeFilter, setTimeFilter] = React.useState("All Events");

  const [events, setEvents] = React.useState<IEvent[]>([]);
  const { loading, setLoading, organizationExists } = useOrganization();

  // Get the currently selected organization ID from Redux
  const selectedOrganizationId = useSelector(selectOrganizationId);
  // State to track if the route is valid
  const [isValidRoute, setIsValidRoute] = React.useState(true);

  const filteredEvents = React.useMemo(() => {
    const now = new Date();

    return events.filter((event) => {
      // Search filter
      const matchesSearch = event.event_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Check if any of the event dates match the filters
      const matchesDateCriteria = event.date_times.some((dateTime) => {
        const eventDate = dateTime.date ? new Date(dateTime.date) : null;

        // Skip events with invalid dates
        if (!eventDate) return false;

        const matchesTimeFilter =
          timeFilter === "All Events" ||
          (timeFilter === "Upcoming Events" && eventDate >= now) ||
          (timeFilter === "Past Events" && eventDate < now);

        // Calendar date filter - compare only if we're in calendar view and have a selected date
        const matchesDate =
          viewType !== "calendar" ||
          !selectedDate ||
          format(eventDate, "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd");

        return matchesTimeFilter && matchesDate;
      });

      return matchesSearch && matchesDateCriteria;
    });
  }, [events, searchQuery, timeFilter, viewType, selectedDate]);

  const getEvents = async () => {
    setLoading(true);
    try {
      // Check route validation for non-all events
      if (params.type !== "all") {
        // Validate if the route's organization ID matches the selected organization
        if (params.type?.toString() !== selectedOrganizationId?.toString()) {
          setIsValidRoute(false);
          setLoading(false);
          return;
        }
      }

      if (params.type === "all") {
        const id = selectedOrganizationId;
        const response = await apiClient.get(
          `${rootPath}/get-events-by-org-id/${id}`
        );
        if (response.data.statusCode === 200) {
          let eventsData = filterEventsBasedOnAccess(response.data.data);

          const sortedEvents = eventsData?.sort((a: IEvent, b: IEvent) => {
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
      } else {
        const id = params.type;
        const response = await apiClient.get(
          `${rootPath}/get-events-by-org-id/${id}`
        );
        if (response.data.statusCode === 200) {
          let eventsData = filterEventsBasedOnAccess(response.data.data);
          const sortedEvents = eventsData?.sort((a: IEvent, b: IEvent) => {
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
      }
    } catch (error) {
      axiosErrorHandler(error, "Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  const filterEventsBasedOnAccess = (events: IEvent[]) => {
    let eventsData = events;
    // Check if user is invited and has specific event access
    const selectedOrg = getSelectedOrganization();
    if (selectedOrg?.invited && selectedOrg?.event_id) {
      // Filter to show only the event they have access to
      eventsData = eventsData.filter(
        (event: IEvent) => event.id === selectedOrg.event_id
      );
    }
    return eventsData;
  };

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const getSelectedOrganization = () => {
    return allOrganizations?.find(
      (org) => org?.organization_id === selectedOrganizationId
    );
  };

  React.useEffect(() => {
    if (organizationExists) {
      getEvents();
    }
  }, [organizationExists, selectedOrganizationId]);

  // If route is invalid, show lock overlay
  if (!isValidRoute) {
    return (
      <>
        <LockOverlay
          isLocked={true}
          message="Access Restricted: You do not have permission to view events for this organization"
          className="border-2 border-red-200 dark:border-tertiary rounded-lg w-screen h-screen"
        ></LockOverlay>
      </>
    );
  }

  const router = useRouter();

  return (
    <>
      {loading && <Loader />}

      {!isValidRoute && (
        <LockOverlay
          isLocked={true}
          message="Access Restricted: You do not have permission to view events for this organization"
          className="border-2 border-red-200 dark:border-tertiary rounded-lg w-screen h-screen"
        >
          <div className="text-center p-8">
            <p>The requested organization events are not accessible.</p>
            <Button onClick={() => router.push("/events/all")} className="mt-4">
              View All Events
            </Button>
          </div>
        </LockOverlay>
      )}

      {organizationExists ? (
        <div className="w-full mx-auto p-4 md:px-14 2xl:px-[12.5%] space-y-4 mb-16 min-h-[calc(100vh-20rem)]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold">Events</h1>
            <Button
              btnStyle="rounded-fill"
              icon={<Plus className="mr-2 h-4 w-4" />}
              onClick={() => router.push("/create-event")}
            >
              Create Event
            </Button>
          </div>

          <div className="flex flex-row flex-wrap justify-start gap-4 text-sm">
            {["All Events", "Upcoming Events", "Past Events"].map((filter) => (
              <div
                key={filter}
                className={`cursor-pointer text-gray-500 dark:text-gray-200 ${
                  timeFilter === filter
                    ? "font-bold text-primary border-b-2 border-primary pb-1"
                    : ""
                }`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter}
              </div>
            ))}
          </div>

          <Tabs value={viewType} onValueChange={setViewType}>
            <div className="flex flex-row flex-wrap justify-start gap-4">
              <div className="flex flex-col sm:flex-row gap-4 dark:bg-tertiary">
                <div className="relative flex-1">
                  <Search className="absolute left-1 top-1 h-7 w-7 p-2 text-white bg-primary rounded-full" />
                  <Input
                    placeholder="Search events"
                    className="p-4 pl-10 rounded-full w-full dark:border dark:border-borderDark border-0 bg-gray-100 dark:bg-tertiary focus:border-0 focus:outline-none focus:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <TabsList className="dark:bg-tertiary dark:border dark:border-borderDark">
                <TabsTrigger value="list" className="text-sm">
                  <ListIcon className="mr-2 h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="space-y-4 mt-6">
              <CreateEventCard />
              <EventCards
                eventsToRender={filteredEvents}
                getEvents={getEvents}
              />
            </TabsContent>

            <TabsContent value="calendar">
              <div className="grid gap-4 mdd:grid-cols-2">
                <Card className="dark:bg-tertiary bg-white border dark:border-borderDark border-gray-50">
                  <CardContent className="p-0 w-full bg-gray">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleSelect}
                      className="rounded-md w-full"
                      modifiers={{
                        eventDates: events.flatMap((event) =>
                          event.date_times
                            .map((dt) => (dt.date ? new Date(dt.date) : null))
                            .filter((date) => date !== null)
                        ),
                        today: [new Date()],
                        selectedDate: selectedDate ? [selectedDate] : [],
                      }}
                      modifiersClassNames={{
                        eventDates: "border-2 border-primary",
                        today: events.some((event) =>
                          event.date_times.some(
                            (dt) =>
                              dt.date &&
                              format(new Date(dt.date), "yyyy-MM-dd") ===
                                format(new Date(), "yyyy-MM-dd")
                          )
                        )
                          ? "bg-primary text-white"
                          : "",
                        selectedDate:
                          "bg-gray-200 dark:bg-gray-700 text-black dark:text-white",
                      }}
                    />
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Events for{" "}
                    {selectedDate
                      ? format(selectedDate, "PPP")
                      : "Selected Date"}
                  </h3>
                  <EventCards
                    eventsToRender={filteredEvents}
                    getEvents={getEvents}
                    calenderView={true}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="w-full mx-auto p-4 md:px-14 2xl:px-[12.5%]space-y-4 mb-16 min-h-[calc(100vh-20rem)]">
          <h1 className="text-2xl md:text-4xl font-bold">
            Please create an organization to view events
          </h1>
          <Button
            btnStyle="rounded-fill"
            icon={<Plus className="mr-2 h-4 w-4" />}
            onClick={() => router.push("/create-organization")}
          >
            Create Organization
          </Button>
        </div>
      )}
    </>
  );
}
