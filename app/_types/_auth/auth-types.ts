export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
    first_name: string;
    last_name: string;
    role?: string;
    phone_no: string;
    country_code: string;
}

export interface OtpFormProps {
    handleSubmit: (e: React.FormEvent) => void;
    formData: SignupFormData;
    otpTime: number;
    timerActive: boolean;
    isLoading: boolean;
    handleResendOtp: () => void;
    setOtpVerify: (value: boolean) => void;
    setOtp: (value: string) => void;
    otp: string;
}

export interface SignupFormProps {
    setFormData: (data: SignupFormData) => void;
    formData: SignupFormData;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export interface OnboardingFormData {
    userId: string;
    city: string;
    state: string;
    country: string;
    dob: string;
    gender: string;
}


export interface ForgotPasswordData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordData {
    email: string;
    password: string;
    confirmPassword: string;
}