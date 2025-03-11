import apiClient from "@/app/_utils/axios";
import { rootPath } from "@/app/_constants/config";

export interface TeamInvitationPayload {
  email: string;
  message: string;
  role_id: number;
  org_id: number;
  modules: number[];
  event_id?: number |null;
}

export const SendTeamInvitationAPI = async (payload: TeamInvitationPayload) => {
  try {
    const response = await apiClient.post(
      `${rootPath}/send-invitation`,
      payload
    );
    return response?.data;
  } catch (error) {
    console.error("Team Invitation Error:", error);
    throw error;
  }
};

export const ValidateTeamInvitationAPI = async (token: string) => {
  if (!token) {
    throw new Error("Token is required");
  }
  try {
    const response = await apiClient.get(
      `${rootPath}/validate-invitation/${token}`
    );
    return response?.data;
  } catch (error) {
    console.error("Team Invitation Error:", error);
    throw error;
  }
};

export const GetOrganizationTeamInvitationAPI = async ({
  org_id,
  page,
  limit,
  event_id,
}: {
  org_id: string;
  page: number;
  limit: number;
  event_id?: string | null;
}) => {
  try {
    let queryParams = `org_id=${org_id}`;
    if (page) {
      queryParams += `&page=${page}`;
    }
    if (limit) {
      queryParams += `&limit=${limit}`;
    }
    if (event_id) {
      queryParams += `&event_id=${event_id}`;
    }
    const url = `${rootPath}/invitations?${queryParams}`;
    const response = await apiClient.get(url);
    return response?.data;
  } catch (error) {
    console.error("Team Invitation Error:", error);
    throw error;
  }
};
