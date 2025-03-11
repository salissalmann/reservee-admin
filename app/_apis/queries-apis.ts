import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";

export const GetQueriesByEventId = async (id: string | number) => {
  try {
    const response = await apiClient.get(`${rootPath}/queries/event/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const UpdateQuery = async (id: string | number, body: any) => {
  const response = await apiClient.put(`${rootPath}/queries/${id}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const CreateQuery = async (body: any) => {
  const response = await apiClient.post(`${rootPath}/queries`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const MarkAsFAQ = async (id: string | number) => {
  const response = await apiClient.post(
    `${rootPath}/queries/${id}/mark-as-faq/`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// FAQS API
export const GetFaqsByEventId = async (id: string | number) => {
  try {
    const response = await apiClient.get(`${rootPath}/faqs/event/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};
export const GetAllFaqs = async () => {
  try {
    const response = await apiClient.get(`${rootPath}/faqs`);
    return response?.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const CreateFaq = async (body: any) => {
  const response = await apiClient.post(`${rootPath}/faq`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const UpdateFAQ = async (id: string | number, body: any) => {
  const response = await apiClient.put(`${rootPath}/faq/${id}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const DeleteFAQ = async (id: string | number) => {
  const response = await apiClient.delete(`${rootPath}/faq/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
