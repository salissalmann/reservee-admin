"use client";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Building2,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EventStateEdit } from "@/app/_types/event-types";
import { motion } from "framer-motion";
import { ICategory } from "@/app/_types/categories-types";

interface FinalFormProps {
  eventData: EventStateEdit;
  categories: [] | ICategory[];
}

export default function FinalForm({ eventData, categories }: FinalFormProps) {
  const mapRef = useRef<L.Map | null>(null);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Date not set";
    return format(date, "MMM dd, yyyy");
  };

  const coverImage = eventData?.images?.files?.find((img: { isCover: boolean }) => img?.isCover);

  useEffect(() => {
    if (!mapRef.current && eventData?.location?.coordinates) {
      const fallbackCoordinates = {
        lat: eventData?.location?.coordinates?.lat || 0,
        lng: eventData?.location?.coordinates?.lng || 0,
      };

      const { lat, lng } = fallbackCoordinates;
      const map = L?.map("preview-map").setView([lat, lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const customIcon = L.divIcon({
        html: `
          <div style="color: red; font-size: 24px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
          </div>
        `,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [eventData?.location.coordinates]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full p-6 space-y-8 dark:bg-tertiary bg-white text-black mx-auto shadow-xl border dark:border-borderDark rounded-lg"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white text-black">
          Event Preview
        </h1>
      </div>

      <Card className="p-6 space-y-6 dark:bg-tertiary bg-white border dark:border-borderDark rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-100">
                  Event Title
                </p>
                <p className="font-semibold dark:text-white text-black">
                  {eventData?.basicInfo.eventTitle}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-100">
                  Date & Time
                </p>
                {eventData?.basicInfo?.dates?.map((dateInfo, index) => (
                  <div key={index}>
                    <p className="font-semibold dark:text-white text-black">
                      {formatDate(dateInfo?.date)}
                    </p>
                    <p className="text-sm">
                      {dateInfo?.startTime} - {dateInfo?.endTime}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-100">
                  Price Range
                </p>
                <p className="font-semibold dark:text-white text-black">
                  {eventData?.basicInfo.price.currency}{" "}
                  {eventData?.basicInfo.price.start} -{" "}
                  {eventData?.basicInfo.price.end}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-100">
                  Organization Name
                </p>
                <p className="font-semibold dark:text-white text-black">
                  {eventData?.basicInfo?.organizationName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-100">
                  Location
                </p>
                <p className="font-semibold dark:text-white text-black">
                  {eventData?.location?.venueName}
                </p>
                <p className="text-sm dark:text-gray-100 text-gray-500">
                  {eventData?.location?.venueAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold dark:text-white text-black">
          Event Media
        </h2>

        {/* Cover Image */}
        {coverImage && (
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
            {/* <Image
              src={coverImage.preview}
              alt="Event cover"
              fill
              className="object-cover"
              style={{
                objectPosition: `${coverImage.focusPoint.x}% ${coverImage.focusPoint.y}%`
              }}
            /> */}
            <img
              src={coverImage.preview}
              alt="Event cover"
              // fill
              className="object-cover"
              style={{
                objectPosition: `${coverImage.focusPoint.x}% ${coverImage.focusPoint.y}%`,
              }}
            />
          </div>
        )}

        {/* Additional Images */}
        <div className="flex gap-4 overflow-x-auto py-2">
          {eventData?.images?.files
            ?.filter((img) => !img.isCover)
            ?.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-lg"
              >
                {/* <Image
                src={image.preview}
                alt={`Event image ${index + 1}`}
                fill
                className="object-cover"
                style={{
                  objectPosition: `${image.focusPoint.x}% ${image.focusPoint.y}%`
                }}
              /> */}
                <img
                  src={image.preview}
                  alt={`Event image ${index + 1}`}
                  className="object-cover"
                  style={{
                    objectPosition: `${image.focusPoint.x}% ${image.focusPoint.y}%`,
                  }}
                />
              </div>
            ))}
        </div>

        {/* Video Section */}
        {/* {eventData?.video && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Event Video</h3>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <video
                src={URL.createObjectURL(eventData?.video)}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )} */}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold dark:text-white text-black">
          Location
        </h2>
        <Card className="overflow-hidden">
          <div id="preview-map" className="w-full h-[300px]" />
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold dark:text-white text-black">
          Description
        </h2>
        <p className="whitespace-pre-wrap">{eventData?.description.summary}</p>
        <div className="flex flex-wrap gap-2">
          {eventData?.description.tags.map((tag) => {
            const category = categories?.find((cat) => cat?.id === tag);
            return (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-red-50 text-red-600"
              >
                {category?.name || "Invalid Category"}
              </Badge>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
