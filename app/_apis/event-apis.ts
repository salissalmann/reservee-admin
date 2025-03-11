import axios from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const GetEventById = async (id: string) => {
  try {
    const response = await apiClient.get(`${rootPath}/get-event-by-id/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const UpdateEventAPI = async (eventId: string | number, body: any) => {
  const response = await apiClient.put(
    `${rootPath}/update-event/${eventId}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const GetEventByOrganizationId = async (id: string) => {
  if (!id || id?.trim()?.length === 0) return null;
  try {
    const response = await apiClient.get(
      `${rootPath}/get-events-by-org-id/${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const AddSeatmapToEvent = async (eventId: string | number, body: any) => {
  const response = await apiClient.put(`${rootPath}/add-seat-map/${eventId}`, body);
  return response.data;
};

export const RemoveSeatmapFromEvent = async (eventId: string | number) => {
  const response = await apiClient.delete(`${rootPath}/delete-seat-map/${eventId}`);
  return response.data;
};

export const GetEventAnalyticsAPI = async (eventId: string | number) => {
  const response = await apiClient.get(`${rootPath}/get-event-analytics/${eventId}`);
  return response.data;
};