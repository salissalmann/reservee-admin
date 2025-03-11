'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { IEvent } from "@/app/_types/event-types";
import { rootPath } from "@/app/_constants/config";

export const useEvent = (id: string) => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${rootPath}/get-event-by-id/${id}`);
        if (response.data.statusCode === 200) {
          setEvent(response.data.data);
        }
      } catch (error) {
        setError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  return { event, isLoading, error };
};
