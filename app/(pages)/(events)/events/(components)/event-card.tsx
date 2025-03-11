"use client";
import { useState } from "react";
import { IEvent } from "@/app/_types/event-types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";
import apiClient from "@/app/_utils/axios";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import Button from "@/app/_components/_layout-components/button";
import { useCheckRouteAccess } from "@/app/_utils/check-route-access";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const EventCards = ({
  eventsToRender,
  getEvents,
  calenderView = false,
}: {
  eventsToRender: IEvent[];
  getEvents: () => void;
  calenderView?: boolean;
}) => {
  const router = useRouter();
  const checkRouteAccess = useCheckRouteAccess();

  const togglePublish = async (
    eventId: string,
    currentStatus: boolean,
    event: IEvent
  ) => {
    try {
      // Comprehensive validation checks
      if (
        (event.venue_config === "" || event.venue_config === null) &&
        (event.ticket_types?.length === 0 || event.ticket_types === null)
      ) {
        toast.error("Event must have a seatmap or ticket types");
        return;
      }

      if (!event.images || event.images.files.length === 0) {
        toast.error("Event must have at least one image");
        return;
      }

      if (
        !event.venue_coords ||
        event.venue_coords.latitude === null ||
        event.venue_coords.longitude === null
      ) {
        toast.error("Event must have a venue");
        return;
      }

      if (!event.venue_name) {
        toast.error("Event must have a venue name");
        return;
      }

      if (!event.event_desc || event.event_desc.length === 0) {
        toast.error("Event must have a description");
        return;
      }

      const response = await apiClient.put(
        `/mark-event-as-published/${eventId}`
      );

      if (response.data.statusCode === 200) {
        toast.success("Event status updated successfully");
        getEvents();
      } else {
        toast.error("Failed to update event status");
      }
    } catch (error) {
      axiosErrorHandler(error, "Error updating event status");
    }
  };

  return (
    <>
      {!eventsToRender?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 dark:bg-tertiary bg-white border dark:border-borderDark border-gray-50">
            <p className="text-muted-foreground dark:text-gray-200">
              No events found
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div
            className={`grid gap-4 ${
              calenderView
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {eventsToRender.map((event) => (
              <Card
                key={event.id ?? "temp-key"}
                className="hover:shadow-lg bg-[#F6F6F6] transition-all duration-200 dark:border-borderDark dark:bg-tertiary border border-[#E8E8E8] flex flex-col"
              >
                <CardHeader className="pb-2">
                  <CardTitle>
                    <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:items-center">
                      <span className="font text-xl">{event.event_title}</span>
                      <Link href={`/edit-event/${event?.id}`}>
                        <Edit />
                      </Link>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground flex flex-row items-center justify-between gap-2">
                      <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                        {event.event_type.charAt(0).toUpperCase() +
                          event.event_type.slice(1)}
                      </span>

                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Switch
                                checked={!!event.is_published}
                                onCheckedChange={() =>
                                  togglePublish(
                                    event.id ?? "",
                                    !!event.is_published,
                                    event
                                  )
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-white">
                                {event.is_published
                                  ? "This event is currently published. Toggle to unpublish."
                                  : "This event is currently unpublished. Toggle to publish."}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.is_published
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {event.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                      {event.date_times.map((dateTime, index) => {
                        const baseDate = dateTime.date
                          ? new Date(dateTime.date)
                          : null;

                        const startTime =
                          dateTime.stime && baseDate
                            ? new Date(
                                baseDate.setHours(
                                  Number.parseInt(dateTime.stime.split(":")[0]),
                                  Number.parseInt(dateTime.stime.split(":")[1])
                                )
                              )
                            : null;

                        const endTime =
                          dateTime.etime && baseDate
                            ? new Date(
                                baseDate.setHours(
                                  Number.parseInt(dateTime.etime.split(":")[0]),
                                  Number.parseInt(dateTime.etime.split(":")[1])
                                )
                              )
                            : null;

                        return (
                          <span
                            key={index}
                            className="text-sm flex  items-center gap-1 text-muted-foreground"
                          >
                            <span className="text-base">📅</span>
                            {baseDate ? format(baseDate, "PPP") : "N/A"}
                            {startTime && (
                              <span>
                                {` ${format(startTime, "p")}`}
                                {endTime && ` - ${format(endTime, "p")}`}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      btnStyle="rounded-fill"
                      btnCover="primary-button"
                      icon={<Eye className="w-4 h-4 mr-2" />}
                      className="w-full text-sm bg-[#E5F2FC] text-[#4476C8] border border-[#E5F2FC] flex items-center justify-center"
                      onClick={() => {
                        if (
                          checkRouteAccess(
                            "/view-event",
                            null,
                            "Event Manager",
                            event.id
                          )
                        ) {
                          router.push(`/event/${event.id}`);
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventCards;
