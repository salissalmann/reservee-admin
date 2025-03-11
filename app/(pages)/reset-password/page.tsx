"use client";

import dynamic from 'next/dynamic';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResetPassword, ResetPasswordRequest } from "@/app/_utils/auth";
import { isAxiosError } from "axios";
import { forgotPasswordValidationSchema } from "@/app/_validations/auth_validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResetPasswordData } from '@/app/_types/_auth/auth-types';

const PasswordInput = dynamic(() => import("@/app/_components/_features/_auth/password_input"));
const OtpSection = dynamic(() => import("@/app/_components/_features/_auth/reset_otp"));

// Types
type ResetPasswordStep = "email" | "otp" | "password";

// Custom hooks
const useResetPasswordForm = () => {
  const [formData, setFormData] = useState<ResetPasswordData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ResetPasswordStep>("email");

  const updateFormData = (field: keyof ResetPasswordData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    validationError,
    loading,
    step,
    setValidationError,
    setLoading,
    setStep,
    updateFormData,
  };
};

const useOtpTimer = () => {
  const [otpTime, setOtpTime] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const startOtpTimer = () => {
    setOtpTime(60);
    setTimerActive(true);
    const timer = setInterval(() => {
      setOtpTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return { otpTime, timerActive, startOtpTimer };
};

// Main component
export default function ForgotPasswordForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const { 
    formData, 
    validationError, 
    loading, 
    step, 
    setValidationError, 
    setLoading, 
    setStep, 
    updateFormData,
    setFormData
  } = useResetPasswordForm();
  const { otpTime, timerActive, startOtpTimer } = useOtpTimer();

  const handleError = (error: unknown) => {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred");
    }
  };

  const requestPasswordReset = async () => {
    try {
      setLoading(true);
      const response = await ResetPasswordRequest({ email: formData.email });
      
      if (response.data.statusCode === 200) {
        toast.success(response?.data?.message || "Reset code sent to your email");
        setStep("otp");
        startOtpTimer();
      } else {
        toast.error("Failed to send reset code");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    try {
      setLoading(true);
      const response = await ResetPassword({
        email: formData.email,
        otp,
        new_password: formData.password,
      });

      if (response.status === 200) {
        toast.success(response?.data?.message || "Password updated successfully");
        router.push("/auth/login");
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      if (step === "email") {
        // await forgotPasswordValidationSchema.validate(formData);

        if (formData.email.length === 0) {
          setValidationError("Email is required");
          return;
        }
        await requestPasswordReset();
      } else if (step === "otp") {
        if (otp.length !== 4) {
          toast.error("Please enter the complete OTP");
          return;
        }
        setStep("password");
      } else if (step === "password") {
        await forgotPasswordValidationSchema.validate(formData);
        await updatePassword();
      }
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error.message);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!timerActive) {
      await requestPasswordReset();
    }
  };

  const resetForm = () => {
    setStep("email");
    setFormData({
      email: "",
      password: "",
      confirmPassword: ""
    });
    setOtp("");
  };

  return (
    <div className="flex w-screen h-[calc(90vh-10rem)] px-5 items-center justify-center">
      <div className={cn(
        "md:max-w-lg w-full border dark:border-borderDark h-fit p-8 flex flex-col items-center justify-center space-y-7",
        "rounded-3xl"
      )}>
        <div className="text-center">
          <h1 className="text-tertiary font-bold text-3xl">
            {step === "email" ? "Forgot Password" : 
             step === "otp" ? "Verify Email" : 
             "Reset Password"}
          </h1>
          <p className="text-gray-400">
            {step === "email" ? "Don't worry! It happens. Please enter your email address." :
             step === "otp" ? `Enter the 4-digit code sent to ${formData.email}` :
             "Enter your new password"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {step === "email" && (
            <div className="border dark:border-borderDark rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full">
              <Mail className="text-gray-400 w-6 h-6" />
              <Input
                type="email"
                onChange={(e) => updateFormData("email", e.target.value)}
                value={formData.email}
                placeholder="Enter your email"
                className="border-none outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
              />
            </div>
          )}

          {step === "otp" && (
            <OtpSection
              otp={otp}
              setOtp={setOtp}
              otpTime={otpTime}
              timerActive={timerActive}
              onResend={handleResendOtp}
            />
          )}

          {step === "password" && (
            <PasswordInput
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {validationError && (
            <p className="text-red-500 text-center">{validationError}</p>
          )}

          <Button
            type="submit"
            variant="default"
            className="w-full rounded-full text-white py-6 font-semibold hover:bg-primary transition-all duration-300"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 
             step === "email" ? "Send Reset Code" :
             step === "otp" ? "Verify Code" :
             "Reset Password"}
          </Button>

          {step === "password" && (
            <div
              className="w-full text-center text-gray-400 cursor-pointer"
              onClick={resetForm}
            >
              Resend OTP
            </div>
          )}

          {step === "email" && (
            <div
              className="w-full text-center text-gray-400 cursor-pointer"
              onClick={() => router.push("/auth/login")}
            >
              Back to Login
            </div>
          )}
        </form>
      </div>
    </div>
  );
}