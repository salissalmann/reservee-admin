'use client'
import React, { useEffect, useState } from 'react'
import MainCanvas from '../main-canvas'
import { SeatSelections } from '../types'
import { GetEventById } from '@/app/_apis/event-apis';
import { useAuth } from "@/app/_providers/initial-load";
import toast from 'react-hot-toast';
import { axiosErrorHandler } from '@/app/_utils/utility-functions';
import { Loader2, AlertCircle, Link } from 'lucide-react';
import { IEvent } from '@/app/_types/event-types';
import Button from '@/app/_components/_layout-components/button';
import { useRouter } from 'next/navigation';

export const runtime = 'edge';

export default function SeatMapPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [eventid, setEventid] = useState<string | null>(null);
  const [fetchedEventData, setFetchedEventData] = useState<IEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const getEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetEventById(id);
      const statusCode = response?.statusCode;

      if (statusCode === 200) {
        const data = response?.data;
        // Check if the current user is authorized to edit this event
        if (data?.user_id === user?.id) {
          setEventid(data?.user_id);
          setFetchedEventData(data);
          setAuthorized(true);
        } else {
          const errorMessage = "You are not authorized to edit this event";
          // toast.error(errorMessage);
          setError(errorMessage);
          setAuthorized(false);
        }
      } else {
        const errorMessage = "Unable to fetch event details";
        // toast.error(errorMessage);
        setError(errorMessage);
        setAuthorized(false);
      }
    } catch (error) {
      const errorMessage = "Event not found.";
      axiosErrorHandler(error, errorMessage);
      setError(errorMessage);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvent();
  }, [id]);

  const router = useRouter();

  const [seatSelections, setSeatSelections] = useState<SeatSelections[]>([])

  if (loading) {
    return <div className="flex justify-center items-center py-8 min-h-screen">
      <div className="flex gap-2 items-center space-x-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-lg font-bold">Loading...</span>
      </div>
    </div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8 text-primary min-h-screen">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg">{error}</span>
        </div>
      </div>
    )
  }

  if (fetchedEventData?.tickets && fetchedEventData?.tickets.length > 0) {
    return (
      <div className="flex justify-center items-center py-8 text-primary min-h-screen">
        <div className="flex flex-col items-center space-x-2 gap-4">
          <AlertCircle className="h-8 w-8" />
          <span className="text-lg text-center font-bold">You cannot add seatmap to this event because it has tickets.</span>
          <p className="text-sm text-center text-gray-500">You can edit the event to add a seatmap.</p>        
          <Button
            btnStyle="rounded-fill"
            onClick={() => {
              router.push(`/edit-event/${id}`);
            }}
          >
            Edit Event
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      {authorized && fetchedEventData && (
        <MainCanvas
          calledFromEventPage={false}
          adjustHeight={false}
          seatSelections={seatSelections}
          setSeatSelections={setSeatSelections}
          eventId={id || ""}
          venueConfig={fetchedEventData?.venue_config || ""}
        />
      )}
    </div>
  )
}
