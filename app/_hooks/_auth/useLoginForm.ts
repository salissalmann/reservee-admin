import { useState } from "react";
import { useAuth } from "@/app/_providers/initial-load";
import { useRouter } from "next/navigation";
import { validationSchema } from "@/app/_validations/validation-schemas";
import { Login } from "@/app/_utils/auth";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import toast from "react-hot-toast";
import * as Yup from "yup";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const router = useRouter();
  const { setUserInfo, login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await validationSchema.validate(formData);
      const response = await Login(formData.email, formData.password);

      if (response?.status === 200) {
        localStorage.clear(); // Clear all existing items
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        setUserInfo(response?.data?.user);
        login();
        router.push("/");
        toast.success("Login successful");
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        toast.error(error.message);
      } else {
        axiosErrorHandler(error, "Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return {
    formData,
    submitting,
    handleSubmit,
    handleChange,
  };
};