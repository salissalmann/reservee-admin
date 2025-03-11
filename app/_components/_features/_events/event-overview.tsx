"use client";

import {
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Eye,
  Users,
  MoreVertical,
  Ticket,
  RockingChair,
  ChartLine,
  TicketX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  LoadingState,
  UnauthorizedState,
} from "@/app/_components/_features/_events/edit-event-form";
import EventLayout from "@/app/_components/_features/_events/event-layout";

import useEventData from "@/app/_hooks/_events/(create-event)/useEventData";
import { useAuth } from "@/app/_providers/initial-load";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import apiClient from "@/app/_utils/axios";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import { cn } from "@/lib/utils";
import TeamMembers from "../_organizations/(dashboard)/team-members";
import { IEvent } from "@/app/_types/event-types";
import { useRouter } from "next/navigation";
import { GetEventAnalyticsAPI } from "@/app/_apis/event-apis";
import { GetCurrencyIcon } from "../../_layout-components/currency-icons";

const EventOveriewLayout = ({ eventId }: { eventId: string }) => {
  const { user } = useAuth();
  const {
    eventData,
    setEventData,
    loading,
    authorized,
    orgId,
    fetchEvent,
    untransformedData,
  } = useEventData(eventId, user, {
    returnUntransformedData: true,
    route: "/view-event",
    role_name: "Event Manager",
  });

  if (loading) return <LoadingState />;

  return (
    <>
      <Toaster />
      {!authorized ? (
        <UnauthorizedState />
      ) : (
        <>
          <EventLayout eventId={eventId} isActive="overview">
            <EventOverview
              event={eventData}
              untransformedData={untransformedData}
            />
          </EventLayout>
        </>
      )}
    </>
  );
};

function EventOverview({
  event,
  untransformedData,
}: {
  event: any;
  untransformedData?: any;
}) {
  // Null-safe date formatting
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Null-safe time formatting
  const formatTime = (time: string | undefined) => {
    if (!time) return "TBD";
    try {
      const [hours, minutes] = time.split(":").map((t) => parseInt(t, 10));
      if (isNaN(hours) || isNaN(minutes)) return "TBD";

      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "TBD";
    }
  };

  // Determine which data source to use
  const eventSource = untransformedData || event;

  // Null-safe date and time extraction
  const firstDate = eventSource?.date_times?.[0]?.date
    ? formatDate(eventSource.date_times[0].date)
    : "TBD";

  const lastDate = eventSource?.date_times?.[eventSource.date_times?.length - 1]
    ?.date
    ? formatDate(eventSource.date_times[eventSource.date_times.length - 1].date)
    : "TBD";

  const startTime = eventSource?.date_times?.[0]?.stime
    ? formatTime(eventSource.date_times[0].stime)
    : "TBD";

  const endTime = eventSource?.date_times?.[eventSource.date_times?.length - 1]
    ?.etime
    ? formatTime(
        eventSource.date_times[eventSource.date_times.length - 1].etime
      )
    : "TBD";

  // Null-safe tag rendering
  const renderTags = () => {
    const tags = eventSource?.tags || [];

    if (!tags.length) return <span className="text-gray-500">No tags</span>;

    return tags.map((tag: { name: string; id: string }) => (
      <span key={tag?.id} className="text-sm text-tertiary">
        #{tag?.name}
      </span>
    ));
  };

  // Null-safe ticket and revenue calculations
  const totalTickets = eventSource?.tickets?.length || 0;
  const ticketPercentage =
    totalTickets > 0 ? Math.round((totalTickets / 1000) * 100) : 20;

  const revenueDisplay = () => {
    const priceStart = eventSource?.price_starting_range;
    const priceEnd = eventSource?.price_ending_range;
    const currency = eventSource?.currency || "USD";

    if (!priceStart || !priceEnd) return "N/A";
    return `${currency} ${priceStart}-${priceEnd}`;
  };

  // Null-safe venue information
  const venueInfo = () => {
    const venueName = eventSource?.venue_name || "Venue Not Specified";
    const venueAddress = eventSource?.venue_address || "Address Not Available";
    return `${venueName}, ${venueAddress}`;
  };

  // Event title
  const eventTitle = eventSource?.event_title || "Untitled Event";

  // Event description
  const eventDescription =
    eventSource?.event_desc || "No description available";

  const organization_name =
    eventSource?.organization_name || "Unknown Organization";

  // Function to toggle publish status
  const togglePublish = async () => {
    try {
      // Validation checks similar to event-card.tsx
      if (
        (eventSource?.venue_config === "" ||
          eventSource?.venue_config === null) &&
        (eventSource?.ticket_types?.length === 0 ||
          eventSource?.ticket_types === null)
      ) {
        toast.error("Event must have a seatmap or ticket types");
        return;
      }

      if (!eventSource?.images || eventSource.images.files.length === 0) {
        toast.error("Event must have at least one image");
        return;
      }

      if (
        !eventSource?.venue_coords ||
        eventSource.venue_coords.latitude === null ||
        eventSource.venue_coords.longitude === null
      ) {
        toast.error("Event must have a venue");
        return;
      }

      if (!eventSource?.venue_name) {
        toast.error("Event must have a venue name");
        return;
      }

      if (!eventSource?.event_desc || eventSource.event_desc.length === 0) {
        toast.error("Event must have a description");
        return;
      }

      const response = await apiClient.put(
        `/mark-event-as-published/${eventSource.id}`
      );

      if (response.data.statusCode === 200) {
        toast.success("Event status updated successfully");
        // Optionally, you might want to refresh the event data here
      } else {
        toast.error("Failed to update event status");
      }
    } catch (error) {
      axiosErrorHandler(error, "Error updating event status");
    }
  };

  // Countdown timer function
  const calculateCountdown = () => {
    if (!eventSource?.date_times || eventSource.date_times.length === 0) {
      return "No event dates available";
    }

    const now = new Date();

    // Find the next upcoming event date
    const upcomingEvents = eventSource.date_times
      .map(
        (datetime: {
          date: string | undefined;
          stime: string;
          etime: string;
        }) => {
          // Parse the date in UTC to ensure consistent comparison
          const fullDateTime = datetime.date
            ? new Date(datetime.date)
            : new Date();

          // Set the time part from stime
          const [hours, minutes] = datetime.stime.split(":").map(Number);
          fullDateTime.setUTCHours(hours, minutes, 0, 0);

          return {
            fullDateTime,
            date: datetime.date,
            stime: datetime.stime,
          };
        }
      )
      .filter((event: { fullDateTime: Date }) => event.fullDateTime > now)
      .sort(
        (a: { fullDateTime: Date }, b: { fullDateTime: Date }) =>
          a.fullDateTime.getTime() - b.fullDateTime.getTime()
      );

    if (upcomingEvents.length === 0) {
      return "Event has passed";
    }

    const nextEvent = upcomingEvents[0];
    const timeDiff = nextEvent.fullDateTime.getTime() - now.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} Days ${hours} Hours ${minutes} Minutes Until Start`;
  };

  // State to manage dynamic countdown
  const [countdown, setCountdown] = useState(calculateCountdown());

  // Effect to update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [eventSource?.date_times]);


  const [loading, setLoading] = useState(false);

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        if (!eventSource?.id) {
          setLoading(false);
          return;
        }
        const analytics = await GetEventAnalyticsAPI(eventSource.id);
        if (analytics.status === true) {
          console.log(analytics.data, "analytics");
          setAnalytics(analytics.data);
        }
      } catch (error) {
        console.error('Failed to fetch event analytics:', error);
        // Optionally show a toast notification
        toast.error('Failed to load event analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [eventSource?.id]);


  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <h1 className="text-[28px] font-extrabold text-tertiary">
          Event Overview
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white dark:bg-tertiary px-4 py-2"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-sm">{eventTitle}</span>
          {/* <ChevronDown className="h-5 w-5" /> */}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-7 p-4 md:p-0">
        {/* First Column */}
        <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-7">
          {/* Event Details Card */}
          <div className="flex-1 rounded-xl p-4 md:p-6 bg-[#F6F6F6] dark:bg-tertiary border border-[#E8E8E8] dark:border-borderDark">
            <h2 className="text-xl md:text-2xl font-extrabold text-tertiary dark:text-white">
              {eventTitle}
            </h2>
            <p className="mt-1 text-xs md:text-sm text-tertiary dark:text-white">
              Organized by {organization_name || "Unknown Organization"}
            </p>

            <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
              <div>
                <dt className="text-xs md:text-sm font-medium text-tertiary dark:text-white">
                  Event Description:
                </dt>
                <dd className="mt-1 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                  {eventDescription?.length > 0
                    ? eventDescription?.length > 150
                      ? eventDescription.substring(0, 150) + "..."
                      : eventDescription
                    : "No description available"}
                </dd>
              </div>

              <div>
                <dt className="text-xs md:text-sm font-medium text-tertiary dark:text-white">
                  Tags:
                </dt>
                <dd className="mt-2 flex gap-2 flex-wrap">{renderTags()}</dd>
              </div>
            </div>
          </div>

          {/* Event Status Card */}
          <div className="rounded-xl bg-white dark:bg-tertiary p-4 md:p-6 border border-gray-200 dark:border-borderDark">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-medium">
                  Event Status
                </h3>
                <div className="flex gap-2">
                  {eventSource?.is_featured && (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                      Featured
                    </Badge>
                  )}
                  {eventSource?.is_disabled && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                      Disabled
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:gap-4">
              <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      eventSource?.is_published ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-xs md:text-sm font-medium">
                    Published Status
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    {eventSource?.is_published ? "Live" : "Draft"}
                  </span>
                  <Switch
                    checked={eventSource?.is_published}
                    onCheckedChange={togglePublish}
                    className="data-[state=checked]:bg-primary scale-75 md:scale-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-medium">
                    Live Countdown Timer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    {countdown}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 md:gap-4 mt-2">
                <div className="flex-1">
                  <div className="text-xs md:text-sm text-gray-400 dark:text-gray-300">
                    Created
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    {new Date(eventSource?.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs md:text-sm text-gray-400 dark:text-gray-300">
                    Last Updated
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    {new Date(eventSource?.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <TeamMembers
              org_id={eventSource?.org_id ? eventSource?.org_id : ""}
              event_id={eventSource?.id || ""}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-7">
          {/* Right Card - Event Details */}
          <div className="rounded-xl bg-white dark:bg-tertiary p-4 md:p-6 border-2 border-primary">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <Calendar className="mt-1 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <div className="text-xs md:text-sm font-bold text-primary">
                    Date:
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm font-semibold text-primary">
                    {firstDate} - {lastDate}
                  </div>
                </div>
                {eventSource?.is_featured && (
                  <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-medium rounded-full">
                    Featured
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-3 text-primary">
                <div className="flex items-center gap-2 md:gap-3">
                  <Clock className="mt-1 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <div className="text-xs md:text-sm font-bold text-primary">
                    Time:
                  </div>
                </div>
                <div className="text-xs md:text-sm">
                  {startTime} - {endTime}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <MapPin className="mt-1 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <div className="text-xs md:text-sm font-bold text-primary">
                    Location:
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm font-medium text-primary">
                    {venueInfo()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 md:p-6 bg-[#F6F6F6] dark:bg-tertiary border border-[#E8E8E8] dark:border-borderDark">
            <h2 className="text-xl md:text-2xl font-extrabold text-tertiary dark:text-white">
              Quick Links
            </h2>

            <div className="mt-3 md:mt-4 flex flex-col gap-2 md:gap-3">
              {[
                {
                  label: "Manage Tickets",
                  href: `/tickets/${eventSource?.id}`,
                  icon: Ticket,
                },
                {
                  label: "Manage Events",
                  href: `/events/all`,
                  icon: RockingChair,
                },
                {
                  label: "Review Orders",
                  href: `/orders-view/${eventSource?.id}`,
                  icon: ChartLine,
                },
                { label: "Handle Refund Requests", href: `/refund-requests/${eventSource?.id}`, icon: TicketX },
              ].map((item, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex items-center gap-2 md:gap-3 justify-start px-2 md:px-4 py-1 hover:bg-white/5 dark:hover:bg-[#1A1A1A]/5"
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 md:h-6 md:w-6 shrink-0 text-primary"
                    )}
                  />

                  <span className="text-xs md:text-sm text-slate-500 dark:text-gray-300 pb-1 underline font-semibold">
                    {item?.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Event Status Section with Tickets */}
          <div className="rounded-xl bg-[#1A1A1A] p-4 md:p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <ChartLine className="h-5 w-5 text-primary" />
                <h3 className="text-base md:text-xl font-medium">Analytics Overview</h3>
              </div>
            </div>

            {loading ? (
              // Skeleton loader
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card Skeleton */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-gray-700 h-8 w-8 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="mt-2">
                    <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>

                {/* Confirmed Orders Card Skeleton */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-gray-700 h-8 w-8 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Canceled Orders Card Skeleton */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-gray-700 h-8 w-8 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="mt-2">
                    <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white/5 rounded-lg p-4 transition-all hover:bg-white/10">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ChartLine className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs">Revenue Generated</span>
                  </div>
                  <div className="mt-2">
                    {analytics?.total_revenue_generated ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{analytics.total_revenue_generated}</span>
                        <span className="text-primary">{GetCurrencyIcon(eventSource?.currency, 4)}</span>
                      </div>
                    ) : (
                      <span className="text-md text-white dark:text-gray-300">No Data Available</span>
                    )}
                  </div>
                </div>

                {/* Confirmed Orders Card */}
                <div className="bg-white/5 rounded-lg p-4 transition-all hover:bg-white/10">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <Ticket className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-xs">Confirmed Orders</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      {analytics?.accepted_orders ? (
                        <span className="text-xl font-bold">{analytics.accepted_orders}</span>
                      ) : (
                        <span className="text-md text-white dark:text-gray-300">No Data Available</span>
                      )}
                    </div>
                    <button 
                      onClick={() => router.push(`/orders-overview/${eventSource?.id}`)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Eye className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Canceled Orders Card */}
                <div className="bg-white/5 rounded-lg p-4 transition-all hover:bg-white/10">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <div className="p-2 rounded-full bg-red-500/10">
                      <TicketX className="h-4 w-4 text-red-500" />
                    </div>
                    <span className="text-xs">Canceled Orders</span>
                  </div>
                  <div className="mt-2">
                    {analytics?.total_canceled_orders ? (
                      <span className="text-xl font-bold">{analytics.total_canceled_orders}</span>
                    ) : (
                      <span className="text-md text-white dark:text-gray-300">No Data Available</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventOveriewLayout;
