import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { ForgotPasswordData } from "@/app/_types/_auth/auth-types";

interface PasswordInputProps {
  formData: ForgotPasswordData;
  updateFormData: (field: keyof ForgotPasswordData, value: string) => void;
}

export default function PasswordInput({ formData, updateFormData }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="relative border border-input rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full">
        <LockKeyhole className="text-gray-400 w-6 h-6" />
        <Input
          type={showPassword ? "text" : "password"}
          onChange={(e) => updateFormData("password", e.target.value)}
          value={formData.password}
          placeholder="New Password"
          className="border-0 border-none w-full outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
        />
        {showPassword ? (
          <Eye
            className="absolute right-4 cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <EyeOff
            className="absolute right-4 cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>

      <div className="relative border border-input rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full">
        <LockKeyhole className="text-gray-400 w-6 h-6" />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
          value={formData.confirmPassword}
          placeholder="Confirm New Password"
          className="border-0 border-none w-full outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
        />
        {showConfirmPassword ? (
          <Eye
            className="absolute right-4 cursor-pointer"
            onClick={() => setShowConfirmPassword(false)}
          />
        ) : (
          <EyeOff
            className="absolute right-4 cursor-pointer"
            onClick={() => setShowConfirmPassword(true)}
          />
        )}
      </div>
    </>
  );
}