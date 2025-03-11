import { useState, useCallback } from "react";
import { EventStateEdit } from "@/app/_types/event-types";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { GetEventById } from "@/app/_apis/event-apis";
import {
  axiosErrorHandler,
  transformFetchedData,
} from "@/app/_utils/utility-functions";
import { useCheckRouteAccess } from "@/app/_utils/check-route-access";
import { checkEventEditAuthorization } from "@/app/_utils/event-authorization";

// Initial State
const initialEventState: EventStateEdit = {
  basicInfo: {
    eventTitle: "",
    eventType: "single",
    dates: [{ date: undefined, startTime: "", endTime: "" }],
    price: {
      start: "",
      end: "",
      currency: "USD",
    },
  },
  images: {
    files: [],
  },
  video: null,
  location: {
    venueName: "",
    venueAddress: "",
    coordinates: { lat: 50.4501, lng: 30.5234 },
  },
  description: {
    summary: "",
    tags: [],
  },
};

// Custom Hooks
const useEventData = (
  eventId: string,
  user: any,
  options?: {
    returnUntransformedData?: boolean;
    route?: string;
    role_name?: string;
  }
) => {
  const [eventData, setEventData] = useState<EventStateEdit>(initialEventState);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [untransformedData, setUntransformedData] = useState<any>(null);
  const checkRouteAccess = useCheckRouteAccess();

  const fetchEvent = useCallback(async () => {
    if (!eventId || !user.id) return;
    setLoading(true);
    try {
      const response = await GetEventById(eventId);
      console.log(response);
      if (response?.statusCode === 200) {
        const data = response?.data;

        // Store untransformed data
        setUntransformedData(data);

        // Check route access
        if (
          checkRouteAccess(
            options?.route || "/edit-event",
            null,
            options?.role_name,
            eventId
          )
        ) {
          // Check event edit authorization?

          setOrgId(data?.org_id);
          setEventData(transformFetchedData(data));
          setAuthorized(true);
          // if (data?.user_id?.toString() === user?.id?.toString()) {
          //   setOrgId(data?.org_id);
          //   setEventData(transformFetchedData(data));
          //   setAuthorized(true);
          // } else {
          //   const isAuthorized = checkEventEditAuthorization(data, user);

          //   if (!isAuthorized) {
          //     setAuthorized(false);
          //   }
          // }
        } else if (data?.user_id === user?.id) {
          setOrgId(data?.org_id);
          setEventData(transformFetchedData(data));
          setAuthorized(true);
        } else {
          // toast.error("You are not authorized to edit this event");
          setAuthorized(false);
        }
      } else {
        throw new Error("Unable to fetch event details");
      }
    } catch (error) {
      axiosErrorHandler(error, "Event not found.");
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  return {
    eventData,
    setEventData,
    loading,
    authorized,
    orgId,
    fetchEvent,
    ...(options?.returnUntransformedData ? { untransformedData } : {}),
  };
};

export default useEventData;
