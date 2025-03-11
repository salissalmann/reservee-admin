import React from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { OtpFormProps } from '@/app/_types/_auth/auth-types';

export default function OtpForm({
    handleSubmit,
    formData,
    otpTime,
    timerActive,
    isLoading,
    handleResendOtp,
    setOtpVerify,
    setOtp,
    otp
}: OtpFormProps) {
    return (
        <form
            onSubmit={handleSubmit}
            className="border dark:border-borderDark border-gray-200 rounded-2xl p-8 w-[95%] max-w-sm  h-96 flex justify-between flex-col items-center gap-4"
        >
            <h1 className="text-2xl font-extrabold dark:text-white text-tertiary text-center">
                Enter Verification Code
            </h1>
            <p className="text-sm dark:text-gray-400 text-gray-400 text-center -mt-2">
                Enter the 4-digit code sent to your email.
                <br />
                <span className="text-primary">{formData.email}</span>
            </p>

            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                    <InputOTPSlot
                        index={0}
                        className="border dark:border-borderDark border-gray-200 w-14 h-10 rounded-3xl shadow-sm"
                    />
                    <InputOTPSeparator />
                    <InputOTPSlot
                        index={1}
                        className="border dark:border-borderDark border-gray-200 w-14 h-10 rounded-3xl shadow-sm"
                    />
                    <InputOTPSeparator />
                    <InputOTPSlot
                        index={2}
                        className="border dark:border-borderDark border-gray-200 w-14 h-10 rounded-3xl shadow-sm"
                    />
                    <InputOTPSeparator />
                    <InputOTPSlot
                        index={3}
                        className="border dark:border-borderDark border-gray-200 w-14 h-10 rounded-3xl shadow-sm"
                    />
                </InputOTPGroup>
            </InputOTP>

            <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm dark:text-gray-400 text-gray-400 text-center -mt-2">
                    Didn't receive the code?
                    <span
                        className={`cursor-pointer ml-1 ${timerActive ? "text-gray-400" : "text-primary"
                            }`}
                        onClick={handleResendOtp}
                    >
                        {timerActive
                            ? `Resend in (0:${otpTime.toString().padStart(2, "0")})`
                            : "Resend Code"}
                    </span>
                </p>
            </div>

            <Button
                type="submit"
                className="w-full rounded-full bg-primary text-white hover:bg-white hover:text-primary border border-primary transition-all duration-300"
                disabled={isLoading || otp.length !== 4}
            >
                {isLoading ? "Verifying..." : "Verify"}
            </Button>

            <p className="text-sm dark:text-gray-400 text-gray-400 text-center -mt-2">
                Change your email?{" "}
                <span
                    className="cursor-pointer text-primary ml-1"
                    onClick={() => {
                        setOtpVerify(false);
                        setOtp("");
                    }}
                >
                    Change
                </span>
            </p>
        </form>
    )
}
