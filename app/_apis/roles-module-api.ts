import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

interface RoleModule {
  role_id?: number | null;
  name: string;
  description: string;
  front_end_route: string;
  backend_routes: string[];
}


export const CreateRoleModuleAPI = async (body: RoleModule) => {
  const response = await apiClient.post(
    `${rootPath}/roles-module/create`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const UpdateRoleModuleAPI = async (
  id: number | string,
  body: Partial<RoleModule>
) => {
  const response = await apiClient.put(
    `${rootPath}/roles-module/update/${id}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const GetRoleModuleByIdAPI = async (id: number | string) => {
  try {
    const response = await apiClient.get(`${rootPath}/role-modules/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Role Module Fetch Error:", error);
    throw error;
  }
};

export const GetRoleModulesAPI = async () => {
  try {
    const response = await apiClient.get(`${rootPath}/roles-module`);
    return response?.data;
  } catch (error) {
    console.error("Role Modules Fetch Error:", error);
    throw error;
  }
};

export const GetRoleModulesByRoleIdAPI = async (roleId: number | string) => {
  try {
    const response = await apiClient.get(`${rootPath}/role-modules/${roleId}`);
    return response?.data;
  } catch (error) {
    console.error("Role Modules by Role Fetch Error:", error);
    throw error;
  }
};
