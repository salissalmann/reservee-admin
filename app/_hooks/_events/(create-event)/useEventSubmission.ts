import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { EventState } from "@/app/_types/event-types";
import apiClient from "@/app/_utils/axios";
import { rootPath } from "@/app/_constants/config";

const useEventSubmission = (eventData: EventState, organizationId: string | null) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const validateEventData = (): boolean => {
        if (!eventData.basicInfo.eventTitle.trim()) {
            toast.error("Event title is required");
            return false;
        }

        if (eventData.basicInfo.eventType === "single") {
            if (
                eventData.basicInfo.dates.length !== 1 ||
                !eventData.basicInfo.dates[0].date ||
                !eventData.basicInfo.dates[0].startTime ||
                !eventData.basicInfo.dates[0].endTime
            ) {
                toast.error("For single events, exactly one date with start and end time is required");
                return false;
            }
        } else {
            for (const dt of eventData.basicInfo.dates) {
                if (!dt.date || !dt.startTime || !dt.endTime) {
                    toast.error("Each date must have a start and end time");
                    return false;
                }
            }
        }

        if (!eventData.basicInfo.price.start || !eventData.basicInfo.price.end) {
            toast.error("Price range is required");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (isSubmitting || !organizationId) return;
        if (!validateEventData()) return;

        try {
            setIsSubmitting(true);

            const date_times = eventData.basicInfo.dates.map(dt => ({
                date: dt.date?.toISOString(),
                stime: dt.startTime,
                etime: dt.endTime,
            }));

            const response = await apiClient.post(
                `${rootPath}/create-event/${organizationId}`,
                {
                    event_title: eventData.basicInfo.eventTitle,
                    event_type: eventData.basicInfo.eventType,
                    price_starting_range: eventData.basicInfo.price.start,
                    price_ending_range: eventData.basicInfo.price.end,
                    currency: eventData.basicInfo.price.currency,
                    date_times,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response?.data?.statusCode === 201) {
                toast.success(response?.data?.message);
                router.push(`/edit-event/${response?.data?.data?.id}`);
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.error || "Failed to create event");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, handleSubmit };
};

export default useEventSubmission;