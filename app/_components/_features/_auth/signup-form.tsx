import React, { useState } from 'react'
import { LockKeyhole, Mail, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneInput, ParsedCountry } from "react-international-phone";
import "react-international-phone/style.css";
import { SignupFormProps } from '@/app/_types/_auth/auth-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function SignupForm({
    setFormData,
    formData,
    handleSubmit,
    loading
}: SignupFormProps) {

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const styles = {
        radius: "rounded-3xl",
        lightTextColor: "[#FAFAFA]",
        spacingY: "space-y-5",
    };

    const handlePhoneChange = (
        value: string,
        meta: {
            country: ParsedCountry;
            inputValue: string;
        }
    ) => {
        const country = meta?.country;

        setFormData({
            ...formData,
            phone_no: value,
            country_code: country?.dialCode,
        });
    };
    return (
        <div
            className={cn(
                "md:max-w-lg w-full border dark:border-borderDark border-gray-200 h-fit p-8 flex flex-col items-center justify-center space-y-7 shadow-lg",
                styles.radius
            )}
        >
            <div className="text-center">
                <h1 className="dark:text-white text-tertiary font-bold text-3xl">
                    Hi There!
                </h1>
                <p className="dark:text-gray-400 text-gray-400">
                    You're almost there! Create your new account by completing these
                    details.
                </p>
            </div>

            <form className="w-full space-y-4">
                <div className="grid lg:grid-cols-2 gap-4 ">
                    <div className="border dark:border-borderDark border-gray-200 rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full ">
                        <User className="text-gray-400 w-6 h-6" />
                        <Input
                            type="text"
                            onChange={(e) =>
                                setFormData({ ...formData, first_name: e.target.value })
                            }
                            value={formData.first_name}
                            placeholder="Enter your first name"
                            className="border-0 border-none w-full outline-none ring-0 shadow-none focus:outline-none focus:outline-0 focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
                        />
                    </div>
                    <div className="border dark:border-borderDark border-gray-200 rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full ">
                        <User className="text-gray-400 w-6 h-6" />
                        <Input
                            type="text"
                            onChange={(e) =>
                                setFormData({ ...formData, last_name: e.target.value })
                            }
                            placeholder="Enter your last name"
                            value={formData.last_name}
                            className="border-0 border-none w-full outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-0 focus-visible:ring-0 "
                        />
                    </div>
                </div>

                <div>
                    <div className="relative z-10">
                        <PhoneInput
                            placeholder="Enter phone number"
                            value={formData.phone_no}
                            onChange={handlePhoneChange}
                            defaultCountry="PK"
                            className="border dark:border-borderDark border-gray-200 rounded-full px-4 py-1 flex items-center justify-start gap-1 w-full"
                            style={
                                {
                                    backgroundColor: "var(--phone-input-bg)",
                                    color: "var(--phone-input-text)",
                                } as React.CSSProperties
                            }
                            inputStyle={{
                                backgroundColor: "var(--phone-input-bg)",
                                color: "var(--phone-input-text)",
                            }}
                        />
                    </div>
                </div>

                <div className="border dark:border-borderDark border-gray-200 rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full -z-10">
                    <Mail className="text-gray-400 w-6 h-6" />
                    <Input
                        type="email"
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        value={formData.email}
                        placeholder="Enter your email"
                        className="border-0 border-none w-full outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-0 focus-visible:ring-0 "
                    />
                </div>
                <div className="relative border dark:border-borderDark border-gray-200 rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full ">
                    <LockKeyhole className="text-gray-400 w-6 h-6" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        value={formData.password}
                        placeholder="Password"
                        className="border-0 border-none w-full outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-0 auto-complete-off"
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

                <div className="relative border dark:border-borderDark border-gray-200 rounded-full px-4 py-1 flex items-center justify-center gap-1 w-full ">
                    <LockKeyhole className="text-gray-400 w-6 h-6" />
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                            })
                        }
                        value={formData.confirmPassword}
                        placeholder="Confirm password"
                        className="border-0 border-none w-full outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-0 auto-complete-off"
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

        
                <div className="flex flex-col space-y-5 ">
                    <Button
                        variant="default"
                        className="rounded-full text-white py-6 font-semibold hover:bg-primary transition-all duration-300 "
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </div>
            </form>
        </div>

    )

}