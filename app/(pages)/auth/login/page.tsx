"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockKeyhole, Mail, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useGoogleAuth } from "@/app/_hooks/_auth/useGoogleAuth";
import { useLoginForm } from "@/app/_hooks/_auth/useLoginForm";
import Branding from "@/app/_components/_layout-components/branding";
import { useAppDispatch } from "@/app/_utils/redux/store";

export const runtime = "edge";

function LoginPageForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const googleLogin = useGoogleAuth();
  const { formData, submitting, handleSubmit, handleChange } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  const styles = {
    radius: "rounded-3xl",
    lightTextColor: "[#FAFAFA]",
    spacingY: "space-y-5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[calc(100vh-10rem)] overflow-hidden px-5 items-center justify-center dark:bg-tertiary bg-white"
    >
      <div
        className={cn(
          "md:max-w-lg w-full border dark:border-borderDark border-[#FAFAFA] h-fit p-10 flex flex-col items-center justify-center space-y-5 shadow-lg",
          styles.radius
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Branding />
          <h1 className="text-2xl font-semibold text-center">Welcome back!</h1>
          <p className="text-muted-foreground text-center">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className={cn("w-full", styles.spacingY)}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={cn("pl-10 bg-transparent", styles.radius)}
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={cn("pl-10 bg-transparent", styles.radius)}
                required
              />
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => router.push("/reset-password")}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-white rounded-full font-bold hover:bg-primaryHover transition-all duration-300 cursor-pointer"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-borderDark border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-muted-foreground bg-background dark:bg-tertiary">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full",
            styles.radius,
            "bg-background dark:bg-tertiary dark:border dark:border-borderDark"
          )}
          onClick={() => googleLogin()}
        >
          <Image
            src="/icons/googleIcon.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Google
        </Button>

        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return <LoginPageForm />;
}
