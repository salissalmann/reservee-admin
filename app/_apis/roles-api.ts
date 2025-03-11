import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const CreateRoleAPI = async (body: {
  name: string;
  description: string;
}) => {
  const response = await apiClient.post(`${rootPath}/roles/create`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const UpdateRoleAPI = async (
  id: string | number,
  body: { name: string; description: string }
) => {
  const response = await apiClient.put(`${rootPath}/roles/update/${id}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const GetRolesAPI = async () => {
  try {
    const response = await apiClient.get(`${rootPath}/roles`);
    return response?.data;
  } catch (error) {
    console.error("Roles Fetch Error:", error);
    throw error;
  }
};
