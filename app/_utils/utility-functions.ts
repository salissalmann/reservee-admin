import axios from "axios";
import toast from "react-hot-toast";
import { EventStateEdit } from "../_types/event-types";

export const axiosErrorHandler = (error: any, elseError: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      // Prioritize backend message, then fallback to status or generic error
      const errorMessage =
        data?.message || data?.error || elseError || `Error ${status}`;

      toast.error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      toast.error("No response from server");
    } else {
      // Something happened in setting up the request
      toast.error(elseError);
    }
  } else {
    // Non-axios error
  toast.error(elseError);
  }
};

export const stripHtml = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};


// Utility Functions
export const transformFetchedData = (data: any): EventStateEdit => {
  return {
    basicInfo: {
      eventTitle: data?.event_title || "",
      eventType: data?.event_type || "single",
      dates: data?.date_times?.map((dt: any) => ({
        date: dt.date ? new Date(dt.date) : undefined,
        startTime: dt.stime || "",
        endTime: dt.etime || "",
      })) || [{ date: undefined, startTime: "", endTime: "" }],
      price: {
        start: data?.price_starting_range || "",
        end: data?.price_ending_range || "",
        currency: data?.currency || "USD",
      },
    },
    images: {
      files: Array.isArray(data?.images?.files) ? data.images.files : [],
    },
    video: data?.video || null,
    location: {
      venueName: data?.venue_name || "",
      venueAddress: data?.venue_address || "",
      coordinates: {
        lat: data?.venue_coords?.latitude || 50.4501,
        lng: data?.venue_coords?.longitude || 30.5234,
      },
    },
    description: {
      summary: data?.event_desc || "",
      tags: Array.isArray(data?.event_tags) ? data.event_tags : [],
    },
    tickets: data?.tickets || [],
    venue_config: data?.venue_config || "",
  };
};

export const transformEventDataForBackend = (eventData: EventStateEdit) => {
  if (!eventData || typeof eventData !== "object") {
    throw new Error("Invalid event data provided");
  }

  return {
    event_title: eventData?.basicInfo?.eventTitle || "",
    event_type: eventData?.basicInfo?.eventType || "",
    price_starting_range: eventData?.basicInfo?.price?.start ?? null,
    price_ending_range: eventData?.basicInfo?.price?.end ?? null,
    currency: eventData?.basicInfo?.price?.currency || "",
    date_times: Array.isArray(eventData?.basicInfo?.dates)
      ? eventData?.basicInfo.dates
        .filter((dt) => dt?.date && dt?.startTime && dt?.endTime)
        .map((dt) => ({
          date: dt.date ? new Date(dt.date).toISOString() : null,
          stime: dt.startTime || "",
          etime: dt.endTime || "",
        }))
      : [],
    gallery: Array.isArray(eventData.images?.files)
      ? eventData?.images?.files
        .filter((file) => file?.preview)
        .map((file) => file.preview)
      : [],
    video: eventData.video || null,
    venue_name: eventData?.location?.venueName || "",
    venue_address: eventData?.location?.venueAddress || "",
    venue_coords: eventData?.location?.coordinates
      ? {
        latitude: eventData?.location?.coordinates.lat ?? null,
        longitude: eventData?.location?.coordinates.lng ?? null,
      }
      : { latitude: null, longitude: null },
    event_desc: eventData?.description?.summary || "",
    event_tags: Array.isArray(eventData?.description?.tags)
      ? eventData?.description.tags
      : [],
    images: eventData?.images,
  };
};

export const formatDate = (date: string | undefined) => {
  if (!date) return "";
  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return formattedDate;
}