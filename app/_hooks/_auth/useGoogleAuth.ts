import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "@/app/_providers/initial-load";
import { useRouter } from "next/navigation";
import { googleValidationSchema } from "@/app/_validations/validation-schemas";
import { GoogleLoginSignup } from "@/app/_utils/auth";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import toast from "react-hot-toast";

interface GoogleUserData {
  username: string;
  fullname: string;
  picture?: string;
  token?: string;
}

export const useGoogleAuth = () => {
  const router = useRouter();
  const { setUserInfo, login } = useAuth();

  const handleGoogleLogin = async (googleUserData: GoogleUserData) => {
    try {
      await googleValidationSchema.validate(googleUserData);
      const { username, fullname, picture } = googleUserData;

      const response = await GoogleLoginSignup(
        username,
        fullname?.split(" ")[0],
        fullname?.split(" ")[1] || "",
        picture || ""
      );

      const isSuccessful = [200, 201].includes(
        response?.status || response?.data?.statusCode
      );

      console.log("Response: ", response);

      if (isSuccessful) {
        const { data } = response;
        localStorage.setItem("access_token", data?.access_token);
        localStorage.setItem("refresh_token", data?.refresh_token);

        setUserInfo(data?.user);
        login();

        if (data?.is_new_user) {
          toast.success("Redirecting to onboarding page...");
          router.push("/auth/onboarding");
        } else {
          toast.success("Successfully logged in!");
          router.push("/");
        }
      }
    } catch (error) {
      axiosErrorHandler(error, "Login failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const { data } = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        await handleGoogleLogin({
          username: data.email,
          fullname: data.name,
          picture: data.picture,
          token: codeResponse.access_token,
        });
      } catch (error) {
        axiosErrorHandler(error, "Google login failed");
      }
    },
    onError: (error) => axiosErrorHandler(error, "Google login failed"),
  });

  return googleLogin;
};
