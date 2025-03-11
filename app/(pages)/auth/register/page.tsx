"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useSignup } from "@/app/_hooks/_auth/useSignup";
import { useOtpTimer } from "@/app/_hooks/_auth/useOtp";
import { validationSchema } from "@/app/_validations/auth_validations";
import { SendOtp, Signup, memberSignupAPI } from "@/app/_utils/auth";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import toast from "react-hot-toast";
import * as Yup from "yup";

// Dynamic imports
const SignupForm = dynamic(
  () => import("@/app/_components/_features/_auth/signup-form")
);
const OtpForm = dynamic(
  () => import("@/app/_components/_features/_auth/otp-form")
);
const Footer = dynamic(
  () => import("@/app/_components/_layout-components/footer")
);

export const runtime = "edge";

export default function SignupContainer() {
  const {
    formData,
    setFormData,
    otpVerify,
    setOtpVerify,
    otp,
    setOtp,
    isLoading,
    setIsLoading,
    handleSignupSuccess,
  } = useSignup();

  const { otpTime, timerActive, startOtpTimer } = useOtpTimer();

  const sendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await SendOtp({
        email: formData.email,
        name: formData.email,
      });

      if (response.status === 200) {
        toast.success("OTP sent successfully");
        setOtpVerify(true);
        startOtpTimer();
      } else {
        toast.error(response.data.error || "Failed to send OTP");
      }
    } catch (error) {
      axiosErrorHandler(error, "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      localStorage.clear();
      e.preventDefault();
      setIsLoading(true);

      try {
        // Validate the form data
        await validationSchema.validate(formData, { abortEarly: false });
        const searchParams = new URLSearchParams(window.location.search);
        const invitationToken = searchParams.get("token");

        if (!otpVerify) {
          await sendOtp();
          return;
        }

        const response = invitationToken
          ? await memberSignupAPI(
              formData.email,
              formData.password,
              formData.first_name,
              formData.last_name,
              formData.role === "Customer" ? "Customer" : "Admin",
              formData.phone_no,
              formData.country_code,
              otp,
              invitationToken
            )
          : await Signup(
              formData.email,
              formData.password,
              formData.first_name,
              formData.last_name,
              formData.role === "Customer" ? "Customer" : "Admin",
              formData.phone_no,
              formData.country_code,
              otp
            );
        if (response?.status === 200) {
          handleSignupSuccess(response, invitationToken);
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const firstError = error.inner[0];
          toast.error(firstError.message);
        } else {
          axiosErrorHandler(error, "Failed to signup");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, otpVerify, otp]
  );

  const handleResendOtp = useCallback(async () => {
    if (!timerActive) {
      await sendOtp();
    }
  }, [timerActive]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      <div className="flex-grow flex items-center justify-center px-5 my-20">
        {!otpVerify ? (
          <SignupForm
            setFormData={setFormData}
            formData={formData}
            handleSubmit={handleSubmit}
            loading={isLoading}
          />
        ) : (
          <OtpForm
            handleSubmit={handleSubmit}
            formData={formData}
            otpTime={otpTime}
            timerActive={timerActive}
            isLoading={isLoading}
            handleResendOtp={handleResendOtp}
            setOtpVerify={setOtpVerify}
            setOtp={setOtp}
            otp={otp}
          />
        )}
      </div>
       
    </div>
  );
}
