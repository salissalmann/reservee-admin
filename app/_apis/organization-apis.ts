import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const GetOrganizationById = async (id: string | number) => {
  try {
    const response = await apiClient.get(
      `${rootPath}/get-organization-by-id/${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const UpdateOrganizationAPI = async (id: string | number, body: any) => {
  const response = await apiClient.put(
    `${rootPath}/update-organization/${id}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const CreateOrganizationAPI = async (body: any) => {
  const response = await apiClient.post(
    `${rootPath}/create-organization`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


export const GetOrganizationAnalyticsAPI = async (id: string | number) => {
  const response = await apiClient.get(
    `${rootPath}/get-organization-analytics/${id}`
  );
  return response.data;
};
