import axios from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const getEventOrdersAPI = async (eventId: string) => {
  const response = await apiClient.get(`${rootPath}/get-event-orders/${eventId}`);
  return response.data;
};

export const getEventOrdersAndItemsAPI = async (eventId: string) => {
  const response = await apiClient.get(`${rootPath}/get-event-orders-and-items/${eventId}`);
  return response.data;
};

export async function get_order_details(order_id: any) {
  const response = await apiClient.get(`${rootPath}/orders/get-order-details/${order_id}`);
  return response.data;
}