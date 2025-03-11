import { Card, CardContent } from "@/components/ui/card";
import Button from "@/app/_components/_layout-components/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const NoEventsCard = () => {
    const router = useRouter();
    return (
        <Card className="dark:bg-tertiary border dark:border-borderDark border-gray-100 shadow-xl">
                <CardContent className="p-6 space-y-2">
                    <div className="flex items-center gap-2 justify-center">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 6v2h14V6H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z" />
                        </svg>
                        <h2 className="text-2xl font-bold">Your Events</h2>
                    </div>

                    <div className="text-center py-2">
                        <p className="text-gray-500 dark:text-gray-300 mb-4">
                            Get started with organizing your next event. Set up details, ticket types, and more.
                        </p>
                        <div className="flex justify-center">
                            <Button btnStyle="rounded-fill" btnCover="primary-button" icon={<Plus className="w-4 h-4 mr-2" />}
                                onClick={() => router.push("/create-event")}
                            >
                                Create New Event
                            </Button>
                        </div>
                    </div>
                </CardContent>
        </Card>
    )
}

export default NoEventsCard;