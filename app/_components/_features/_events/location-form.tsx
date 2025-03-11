"use client";

import { useRef, useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import L, { Map, Marker, LeafletMouseEvent, LeafletEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { EventStateEdit } from "@/app/_types/event-types";
import { motion } from "framer-motion";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

interface LocationFormProps {
  data: EventStateEdit["location"];
  onUpdate: (data: Partial<EventStateEdit["location"]>) => void;
}

export default function LocationForm({ data, onUpdate }: LocationFormProps) {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Prevent re-initializing if the map already exists
    if (mapRef.current) return;

    // Fallback coordinates (e.g., default to [0, 0] if data.coordinates is invalid)
    const fallbackCoordinates = {
      lat: data?.coordinates?.lat || 0,
      lng: data?.coordinates?.lng || 0,
    };

    const { lat, lng } = fallbackCoordinates;

    // Initialize the map with fallback coordinates
    const map = L?.map("map")?.setView([lat, lng], 13);

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

    const marker = L.marker([lat, lng], {
      draggable: true,
      icon: customIcon,
    }).addTo(map);

    markerRef.current = marker;
    mapRef.current = map;

    // Handle map click and marker drag events
    map.on("click", (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng(e.latlng);
      onUpdate({ coordinates: { lat, lng } });
      reverseGeocode(lat, lng);
    });

    marker.on("dragend", (e: LeafletEvent) => {
      const { lat, lng } = e.target.getLatLng();
      onUpdate({ coordinates: { lat, lng } });
      reverseGeocode(lat, lng);
    });
  }, [data.coordinates]); // Re-run effect when coordinates change

  const searchLocation = async (query: string = searchQuery) => {
    if (!query.trim()) {
      if (data.venueAddress.trim()) {
        query = data.venueAddress;
      } else {
        return;
      }
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const searchData = await response.json();

      if (searchData && searchData.length > 0) {
        const { lat, lon, display_name } = searchData[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);

        if (mapRef.current && markerRef.current) {
          mapRef.current?.setView([latNum, lonNum], 15);
          markerRef.current?.setLatLng([latNum, lonNum]);
          onUpdate({
            coordinates: { lat: latNum, lng: lonNum },
            venueAddress: display_name,
          });
        }
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchLocation();
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const geocodeData = await response.json();

      if (geocodeData && geocodeData.display_name) {
        onUpdate({ venueAddress: geocodeData.display_name });
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full p-6 space-y-6 bg-white text-black mx-auto shadow-xl border dark:border-borderDark rounded-xl dark:bg-transparent"
    >
      <h1 className="text-4xl font-bold dark:text-white">Location</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="venueName" className="dark:text-white">
            Venue Name <span className="text-red-500">*</span>
          </Label>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative"
          >
            <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            <Input
              id="venueName"
              value={data.venueName}
              onChange={(e) => onUpdate({ venueName: e.target.value })}
              className="pl-10 dark:text-gray-100 dark:bg-transparent border dark:border-borderDark border-gray-200 rounded-full"
              placeholder="Enter Venue Name"
              maxLength={200}
            />
          </motion.div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venueAddress" className="dark:text-white">
            Venue Address <span className="text-red-500">*</span>
          </Label>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative"
          >
            <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            <Input
              id="venueAddress"
              value={data.venueAddress}
              onChange={(e) => onUpdate({ venueAddress: e.target.value })}
              onBlur={() => searchLocation(data.venueAddress)}
              className="pl-10 dark:text-gray-100 dark:bg-transparent border dark:border-borderDark border-gray-200 rounded-full"
              placeholder="Enter Venue Address"
              maxLength={500}
            />
          </motion.div>
        </div>

        <div className="space-y-2">
          <Label className="dark:text-white">Search on Map</Label>
          <div className="flex gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex-1"
            >
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Search for a location"
                className="dark:text-gray-100 dark:bg-transparent border dark:border-borderDark border-gray-200 rounded-full"
              />
            </motion.div>
            <Button
              onClick={() => searchLocation()}
              className="bg-white hover:bg-gray-100 dark:bg-transparent dark:border dark:border-borderDark"
            >
              <Search className="h-5 w-5 text-black dark:text-white" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="dark:text-white">Map Location</Label>
        <div
          id="map"
          className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200"
        />
      </div>
    </motion.div>
  );
}
