import axios from "axios";
import apiClient from "./axios";
import { rootPath } from "@/app/_constants/config";
const path = "/auth";

export const Login = async (email: string, password: string) => {
  //pass form data and not json
  const response = await axios.post(`${rootPath}${path}/log-in`, {
    email: email,
    password: password,
  });
  return response;
};

export const Signup = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  role: string,
  phone_no: string,
  country_code: string,
  otp: string
) => {
  const response = await axios.post(
    `${rootPath}${path}/sign-up`,
    {
      email,
      password,
      first_name,
      last_name,
      role,
      phone_no,
      country_code,
      otp,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

export const Logout = async (refreshToken: string) => {
  const response = await apiClient.get(`${path}/logout/${refreshToken}`);
  console.log(response, "response Logout");
  return response;
};

export const getLoggedInUserClient = async () => {
  const response = await apiClient.get(`/users`);
  // console.log(response, "response getLoggedInUserClient");
  return response;
};

export const Onboarding = async (formData: any) => {
  const response = await apiClient.put(`users/onboard`, formData);
  return response;
};

export const SendOtp = async (formData: any) => {
  const response = await axios.post(`${rootPath}/otp/send-otp`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response, "response SendOtp");
  return response;
};

export const ResetPasswordRequest = async (formData: any) => {
  const response = await axios.post(
    `${rootPath}${path}/forgot-password`,
    formData
  );
  return response;
};

export const ResetPassword = async (formData: any) => {
  const response = await axios.post(
    `${rootPath}${path}/reset-password`,
    formData
  );
  return response;
};

export const GoogleLoginSignup = async (
  email: string,
  first_name: string,
  last_name: string,
  image: string
) => {
  const response = await axios.post(`${rootPath}${path}/google/log-in`, {
    email: email,
    image: image,
    first_name,
    last_name,
  });
  return response;
};

export const validateOtp = async (formData: any) => {
  const response = await apiClient.post(`/otp/validate-otp`, formData);
  return response;
};

export const memberSignupAPI = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  role: string,
  phone_no: string,
  country_code: string,
  otp: string,
  invitation_id: string
) => {
  const response = await axios.post(
    `${rootPath}${path}/member/sign-up`,
    {
      email,
      password,
      first_name,
      last_name,
      role,
      phone_no,
      country_code,
      otp,
      invitation_id,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};
