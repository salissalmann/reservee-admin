import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export const BookingTabContent = () => {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
            <Card className="dark:bg-tertiary dark:border-borderDark">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Booking History</CardTitle>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-8 w-8" />
                    </Button>
                </CardHeader>
                <CardContent className="dark:bg-tertiary dark:border-borderDark">
                    <Button className="w-full dark:bg-tertiary dark:border-borderDark" variant="outline" onClick={() => router.push("/my-purchases")}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Booking History
                    </Button>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center h-fit p-4 gap-2 border-[#b8cff5] rounded-lg shadow-none dark:bg-tertiary dark:border-borderDark hover:scale-105 transition-all duration-300"
                onClick={() => router.push("/my-purchases")}
            >
                <Eye className="h-6 w-6 text-secondary" />
                <CardTitle>Booking History</CardTitle>
                <CardDescription>View your booking history.</CardDescription>
            </Card>
        </div>
    )
}
    