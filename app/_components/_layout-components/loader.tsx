import { Loader2 } from "lucide-react";
import AnimatedBranding from "./animated-branding";

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 h-screen w-screen flex flex-col items-center justify-center gap-4">
            <AnimatedBranding />
            <Loader2 className="animate-spin text-primary text-4xl" />
        </div>
    )
}