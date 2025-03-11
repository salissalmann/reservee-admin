import { Euro, DollarSign, PoundSterling, IndianRupee } from "lucide-react";

export const GetCurrencyIcon = (currency: string, size: number = 4) => {
    if (currency === "EUR") {
        return <Euro className={`w-${size} h-${size}`} />
    }
    else if (currency === "USD") {
        return <DollarSign className={`w-${size} h-${size}`} />
    }
    else if (currency === "GBP") {
        return <PoundSterling className={`w-${size} h-${size}`} />
    }
    else if (currency === "INR") {
        return <IndianRupee className={`w-${size} h-${size}`} />
    }
    else if (currency === "PKR") {
        return <div className={`w-${size} h-${size}`}>₨</div>
    }
    else if (currency === "AED") {
        return <div className={`w-${size} h-${size}`}>د.ل</div>
    }
    else if (currency === "SAR") {
        return <div className={`w-${size} h-${size}`}>ر.س</div>
    }

    return <Euro className={`w-${size} h-${size}`} />
}