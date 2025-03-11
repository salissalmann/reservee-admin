import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpSectionProps {
    otp: string;
    setOtp: (value: string) => void;
    otpTime: number;
    timerActive: boolean;
    onResend: () => void;
}

export default function OtpSection({
    otp,
    setOtp,
    otpTime,
    timerActive,
    onResend,
}: OtpSectionProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-14 h-10 rounded-3xl shadow-sm" />
                    <InputOTPSeparator />
                    <InputOTPSlot index={1} className="w-14 h-10 rounded-3xl shadow-sm" />
                    <InputOTPSeparator />
                    <InputOTPSlot index={2} className="w-14 h-10 rounded-3xl shadow-sm" />
                    <InputOTPSeparator />
                    <InputOTPSlot index={3} className="w-14 h-10 rounded-3xl shadow-sm" />
                </InputOTPGroup>
            </InputOTP>

            <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm text-gray-500 text-center">
                    Didn't receive the code?
                    <span
                        className={`cursor-pointer ml-1 ${timerActive ? "text-gray-400" : "text-primary"
                            }`}
                        onClick={onResend}
                    >
                        {timerActive
                            ? `Resend in (0:${otpTime.toString().padStart(2, "0")})`
                            : "Resend Code"}
                    </span>
                </p>
            </div>
        </div>
    );
}