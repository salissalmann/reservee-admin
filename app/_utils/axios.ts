import axios from "axios";
import { rootPath } from "@/app/_constants/config";

// Base URL for all API requests
const baseURL = rootPath;

// Configuration for the API client
export const apiConfig = {
  baseURL,
};

// Initialize Axios instance with default settings
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  withCredentials: false, // Set to true if cookies need to be sent
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json", // Default content type for all requests
  },
});

// Helper to retrieve tokens from localStorage
export const getTokens = () => ({
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
});

// Helper to save tokens to localStorage
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

// Add Authorization header to each request if access token exists
apiClient.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle errors and refresh tokens
apiClient.interceptors.response.use(
  (response) => {
    // Return the response as-is if successful
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors and attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops

      try {
        const { refreshToken } = getTokens();

        if (!refreshToken) {
          console.error("Refresh token is missing.");
          redirectToLogin(); // Redirect to login if no refresh token
          return Promise.reject(error);
        }

        // Attempt to refresh tokens
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });

        // If refresh is successful, update tokens and retry the original request
        if (
          response.status === 200 &&
          response.data?.access_token &&
          response.data?.refresh_token
        ) {
          setTokens(response.data.access_token, response.data.refresh_token);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.access_token}`;
          return apiClient(originalRequest);
        } else {
          console.error(
            "Unexpected response during token refresh:",
            response.data
          );
          redirectToLogin();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Handle refresh token errors
        if (refreshError instanceof axios?.AxiosError) {
          const refreshErrorMessage = refreshError.response?.data?.message;
          if (
            [
              "Refresh token is required",
              "Refresh token has expired",
              "Invalid refresh token",
              "Invalid or mismatched refresh token",
            ].includes(refreshErrorMessage)
          ) {
            console.error(
              "Refresh token invalid or expired:",
              refreshErrorMessage
            );
          } else {
            console.error(
              "Error refreshing token:",
              refreshErrorMessage || refreshError.message
            );
          }
        } else {
          console.error("Unexpected error during token refresh:", refreshError);
        }

        redirectToLogin(); // Redirect to login on failure
        return Promise.reject(refreshError);
      }
    }

    // Reject promise for other errors
    return Promise.reject(error);
  }
);

// Helper function to handle redirection to the login page
const redirectToLogin = () => {
  localStorage.removeItem("access_token"); // Clear access token
  localStorage.removeItem("refresh_token"); // Clear refresh token
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login"; // Redirect to login page
  }
};

export default apiClient;
