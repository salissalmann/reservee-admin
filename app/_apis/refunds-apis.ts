import axios from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const GetRefunds = async (id: string) => {
  try {
    const response = await apiClient.get(`${rootPath}/refunds/get-refunds/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const ChangeRefundStatus = async (refundId: string, status: string) => {
  try {
    const response = await apiClient.put(`${rootPath}/refunds/change-refund-status/${refundId}`, { status });
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};