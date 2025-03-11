import { useState } from 'react';
import { SignupFormData } from '@/app/_types/_auth/auth-types';
import { useAuth } from '@/app/_providers/initial-load';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const useSignup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    phone_no: '',
    first_name: '',
    last_name: '',
    role: 'Customer',
    country_code: '92',
  });
  const [otpVerify, setOtpVerify] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUserInfo, login } = useAuth();
  const router = useRouter();

  const handleSignupSuccess = (response: any, invitationToken: string | null) => {
    localStorage.setItem(
      'access_token',
      response.data?.access_token || response?.access_token
    );
    localStorage.setItem(
      'refresh_token',
      response.data?.refresh_token || response?.refresh_token
    );

    const user = response?.data?.data?.user || response?.data?.user;
    setUserInfo(user);
    login();

    router.push(invitationToken ? '/select-organization' : '/auth/onboarding');
    toast.success('Signup successful');
  };

  return {
    formData,
    setFormData,
    otpVerify,
    setOtpVerify,
    otp,
    setOtp,
    isLoading,
    setIsLoading,
    handleSignupSuccess,
  };
};