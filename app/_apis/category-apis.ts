import axios from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const GetAllCategories = async () => {
  try {
    const response = await apiClient.get(
      `${rootPath}/get-published-categories`
    );
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};
