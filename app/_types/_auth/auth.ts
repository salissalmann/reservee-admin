// export interface IUser {
//     id: string;
//     email: string;
//     name: string;
//     role: string;
//     walletAddress: string;
//     city?: string;
//     state?: string;
//     phoneNumber?: string;
//     country?: string;
//   }

export interface IUser {
  id: number | null;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  city: string | null;
  state: string | null;
  country: string | null;
  countryCode: string;
  dob: string | null;
  gender: string | null;
  phone_no: string;
  image: string | null;
  emailVerified: boolean;
  is_google: boolean;
  isDeleted: boolean;
  isDisabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  is_public?: boolean;
  country_code?: string;
} 

export interface AuthResponse {
  user: IUser;
  access_token: string;
  refreshToken: string;
  status: number;
}

export interface OnboardingData {
  city: string;
  state: string;
  phoneNumber: string;
  country: string;
}
