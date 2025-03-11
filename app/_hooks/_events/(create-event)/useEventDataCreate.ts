import { useState } from "react";
import { EventState } from "@/app/_types/event-types";
import { useCallback } from "react";

const useEventDataCreate = () => {
    const [eventData, setEventData] = useState<EventState>({
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
        images: { files: [] },
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
    });

    const updateEventData = useCallback((
        section: keyof EventState,
        data: Partial<EventState[keyof EventState]>
    ) => {
        setEventData((prev) => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                ...(data as object),
            },
        }));
    }, []);

    return { eventData, updateEventData };
};

export default useEventDataCreate;
