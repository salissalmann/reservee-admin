import axios from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const AddMultipleTickets = async (body: any) => {
  try {
    const response = await apiClient.post(`${rootPath}/tickets/multiple`, body);
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const ValidateQRCode = async (code: string) => {
    const response = await apiClient.get(`${rootPath}/validate-qr/${code}`);
    return response?.data;
}