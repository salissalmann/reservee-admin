"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { CalendarIcon } from "lucide-react";
import { UpdateEventAPI } from "@/app/_apis/event-apis";
import { EventStateEdit } from "@/app/_types/event-types";
import { uploadMultipleFiles } from "@/app/_apis/util-apis";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/app/_providers/initial-load";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/app/_components/_features/_events/edit-event-form";
import { transformEventDataForBackend } from "@/app/_utils/utility-functions";
import { STEPS } from "@/app/_components/_features/_events/edit-event-form";
import {
  LoadingState,
  UnauthorizedState,
  StepperHeader,
  NavigationButtons,
} from "@/app/_components/_features/_events/edit-event-form";
import useEventData from "@/app/_hooks/_events/(create-event)/useEventData";
import { useGetCategories } from "@/app/_hooks/_categories/useGetCategories";

interface EventDetailsProps {
  eventId: string;
}

// Dynamic Imports
const ImageUploadForm = dynamic(
  () => import("@/app/_components/_features/_events/image-upload-form"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const CreateEventForm = dynamic(
  () => import("@/app/_components/_features/_events/basic-information-form"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const SeatmapForm = dynamic(
  () => import("@/app/_components/_features/_events/seatmap-form"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const LocationForm = dynamic(
  () => import("@/app/_components/_features/_events/location-form"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const DescriptionForm = dynamic(
  () => import("@/app/_components/_features/_events/event-description"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const FinalForm = dynamic(
  () => import("@/app/_components/_features/_events/final-form"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const EventDetails: React.FC<EventDetailsProps> = ({ eventId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [stepper, setStepper] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const { eventData, setEventData, loading, authorized, orgId, fetchEvent } =
    useEventData(eventId, user);


  const { categories } = useGetCategories();

  // Event data update handler
  const updateEventData = useCallback(
    (
      section: keyof EventStateEdit,
      data: Partial<EventStateEdit[keyof EventStateEdit]>
    ) => {
      setEventData((prev) => ({
        ...prev,
        [section]:
          section === "video" && (data === null || data === undefined)
            ? null
            : {
                ...(prev[section] as object),
                ...(data as object),
              },
      }));
    },
    []
  );

  // Validation
  const validateEventData = useCallback((data: EventStateEdit): boolean => {
    if (data.basicInfo.eventType === "single") {
      if (
        data.basicInfo.dates.length !== 1 ||
        !data.basicInfo.dates[0].date ||
        !data.basicInfo.dates[0].startTime ||
        !data.basicInfo.dates[0].endTime
      ) {
        toast.error(
          "For single events, exactly one date with start and end time is required"
        );
        return false;
      }
    } else {
      for (const dt of data.basicInfo.dates) {
        if (!dt.date || !dt.startTime || !dt.endTime) {
          toast.error("Each date must have a start and end time");
          return false;
        }
      }
    }
    return true;
  }, []);

  // Image processing
  const processImages = async (eventData: EventStateEdit) => {
    const newImagesToUpload = eventData?.images?.files?.filter((fileItem) =>
      fileItem.preview.startsWith("blob:")
    );

    let uploadedImages: string[] = [];
    if (newImagesToUpload?.length > 0) {
      const uploadedImageFiles = await uploadMultipleFiles(
        newImagesToUpload.map((fileItem) => fileItem.file)
      );
      uploadedImages = Array.isArray(uploadedImageFiles?.data)
        ? uploadedImageFiles?.data
        : [];
    }

    return eventData?.images?.files.map((fileItem) => {
      if (fileItem.preview.startsWith("blob:")) {
        const uploadedUrl = uploadedImages?.shift();
        return {
          ...fileItem,
          preview: uploadedUrl || fileItem?.preview,
        };
      }
      return fileItem;
    });
  };

  // Video processing
  const processVideo = async (videoFile: File | null) => {
    if (!videoFile) return null;

    const uploadedVideoFile = await uploadMultipleFiles([videoFile]);
    return Array.isArray(uploadedVideoFile?.data)
      ? uploadedVideoFile?.data[0]
      : null;
  };

  // Event update handler
  const handleEventUpdate = async () => {
    if (isSubmitting) return;

    try {
      if (!validateEventData(eventData)) return;

      setIsSubmitting(true);

      // Process images and video
      const updatedFiles = await processImages(eventData);
      const uploadedVideo = await processVideo(videoFile);

      // Prepare updated event data
      const updatedEventData = {
        ...eventData,
        images: {
          ...eventData?.images,
          files: updatedFiles,
        },
        video: uploadedVideo || eventData?.video,
      };

      // Transform and send to backend
      const backendPayload = transformEventDataForBackend(updatedEventData);
      const response = await UpdateEventAPI(eventId, backendPayload);

      if (response.statusCode === 200) {
        toast.success("Event updated successfully.");
        if (stepper === STEPS.length - 1) {
          router.push("/events/all");
        }
      } else {
        throw new Error(response?.message || "Failed to update event");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleNext = useCallback(() => {
    const isSubmitScreen = stepper === STEPS.length - 1;
    if (isSubmitScreen) {
      handleEventUpdate();
    } else if (stepper < STEPS.length - 1) {
      setStepper((prev) => prev + 1);
    }
  }, [stepper, handleEventUpdate]);

  const handleBack = useCallback(() => {
    if (stepper > 0) {
      setStepper((prev) => prev - 1);
    }
  }, [stepper]);

  // Render form based on current step
  const renderStepContent = () => {
    switch (stepper) {
      case 0:
        return (
          <CreateEventForm
            data={eventData.basicInfo}
            onUpdate={(data) => updateEventData("basicInfo", data)}
            mode="edit"
          />
        );
      case 1:
        return (
          <ImageUploadForm
            data={eventData.images}
            video={eventData.video}
            onUpdate={(data) => updateEventData("images", data)}
            onVideoUpdate={(video) => updateEventData("video", video)}
            setVideoFile={setVideoFile}
          />
        );
      case 2:
        return (
          <LocationForm
            data={eventData.location}
            onUpdate={(data) => updateEventData("location", data)}
          />
        );
      case 3:
        return (
          <SeatmapForm
            id={eventId}
            orgId={orgId || ""}
            tickets={eventData.tickets || []}
            setStepper={setStepper}
            venue_config={eventData.venue_config || ""}
            getEvent={fetchEvent}
          />
        );
      case 4:
        return (
          <DescriptionForm
            data={eventData.description}
            onUpdate={(data) => updateEventData("description", data)}
            categories={categories || []}
          />
        );
      case 5:
        return <FinalForm eventData={eventData} categories={categories} />;
      default:
        return null;
    }
  };

  if (loading) return <LoadingState />;
  // if (!authorized) return <UnauthorizedState />;

  return (
    <>
       
      <Toaster />
      {!authorized ? (
        <UnauthorizedState />
      ) : (
        <>
          {" "}
          <StepperHeader currentStep={stepper} onStepClick={setStepper} />
          <div className="w-full mg:w-[90%] lg:w-[80%] mx-auto px-4 min-h-[calc(100vh-20rem)]">
            <div
              className={`grid grid-cols-1 ${
                stepper === 3 ? "lg:grid-cols-1" : "lg:grid-cols-[75%_25%]"
              } mt-4 gap-4`}
            >
              <div className="order-2 lg:order-1 min-h-96">{renderStepContent()}</div>

              {stepper !== 3 && (
                <div className="bg-white dark:bg-transparent order-1 lg:order-2">
                  <EventSidebar
                    eventTitle={eventData.basicInfo.eventTitle}
                    eventDate={eventData.basicInfo.dates[0]?.date}
                    isSubmitting={isSubmitting}
                    onSave={handleEventUpdate}
                  />
                </div>
              )}
            </div>

            {stepper !== 3 && (
              <NavigationButtons
                stepper={stepper}
                onBack={handleBack}
                onNext={handleNext}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </>
      )}

       
    </>
  );
};

// Event Sidebar Component
const EventSidebar: React.FC<{
  eventTitle: string;
  eventDate?: Date;
  isSubmitting: boolean;
  onSave: () => void;
}> = ({ eventTitle, eventDate, isSubmitting, onSave }) => (
  <div className="space-y-4 p-4 bg-white dark:bg-transparent shadow-xl border dark:border-borderDark border-gray-50 rounded-lg">
    <h1 className="text-2xl font-semibold tracking-tight">
      {eventTitle || "Event Title"}
    </h1>

    <div className="flex flex-col gap-4 justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="h-6 w-6 text-gray-500" />
        <span className="text-gray-500 font-[11px]">
          {eventDate
            ? new Date(eventDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Date not set"}
        </span>
      </div>

      <button
        className="bg-primary text-white px-4 py-1 text-md font-semibold rounded-full hover:bg-white hover:dark:bg-gray-800 hover:text-primary transition-all duration-300 cursor-pointer"
        onClick={onSave}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
);

export default EventDetails;
