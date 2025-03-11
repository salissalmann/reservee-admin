import axios from "axios";
import { rootPath } from "@/app/_constants/config";
import apiClient from "../_utils/axios";

export const loginAPI = async (body: FormData) => {
  const response = await axios.post(`${rootPath}/auth/login`, body, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const signupAPI = async (
  email: string,
  password: string,
  name: string,
  role: string,
  walletAddress: string
) => {
  const response = await axios.post(
    `${rootPath}/auth/signup`,
    {
      email,
      password,
      name,
      role,
      wallet_address: walletAddress,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};
export const memberSignupAPI = async (
  email: string,
  password: string,
  name: string,
  role: string,
  walletAddress: string,
invitation_id: string
) => {
  const response = await axios.post(
    `${rootPath}/auth/member/sign-up`,
    {
      email,
      password,
      name,
      role,
      wallet_address: walletAddress,
      invitation_id,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const isLoggedInAPI = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.rootPath}/auth/isLoggedin`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Authorization Error:", error);
    throw error;
  }
};

export const changePasswordAPI = async (body: {
  old_password: string;
  new_password: string;
}) => {
  const response = await apiClient.put(
    `${rootPath}/users/change-password`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


//app.put("/users/profile", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
  // const userId = parseInt(c.get("user_id"));
  // const { first_name, last_name, email, phone_no, city, state, country, dob, gender, is_public, country_code, image }
  
export const updateProfileAPI = async (body: {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  city: string;
  state: string;
  country: string;
  dob: string;
  gender: string;
  is_public: boolean;
  country_code: string;
  image: string;
}) => {
  const response = await apiClient.put(`${rootPath}/users/profile`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
