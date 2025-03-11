import axios, { AxiosRequestConfig } from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const uploadMultipleFiles = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await apiClient.post(
      `${rootPath}/file-upload/multiple`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};

export const uploadSingleFile = async (file: File) => {
  // Upload a single file
  try {
    const formData = new FormData();
    formData.append("file", file);

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await apiClient.post(
      `${rootPath}/file-upload`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
