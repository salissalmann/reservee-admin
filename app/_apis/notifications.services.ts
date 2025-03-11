import axios from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export async function getNotifications(role: string) {
  const response = await apiClient.get(`${rootPath}/get-notifications/${role}`);
  return response.data;
}

export async function markNotificationAsRead(notificationId: number) {
  const response = await apiClient.post(`${rootPath}/mark-notification-as-read/${notificationId}`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await apiClient.post(`${rootPath}/mark-all-notifications-as-read`);
  return response.data;
}

