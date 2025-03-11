import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const SupportTabContent = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
            <Card className="dark:bg-tertiary dark:border-borderDark">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl dark:text-white">Support</CardTitle>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-8 w-8" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 dark:bg-tertiary dark:border-borderDark">
                    <div className="flex gap-2">
                        <Input placeholder="Search FAQs..." className="shadow-none rounded-full dark:bg-tertiary dark:border-borderDark" />
                        <Button className="bg-tertiary text-white dark:bg-white dark:text-black rounded-full font-bold text-md px-8 py-1 hover:scale-105 transition-all duration-300">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {[
                            {
                                question: "I forgot my password. How can I reset it?",
                                answer: "Click on the \"Forgot Password?\" link on the login page, enter your registered email, and follow the instructions sent to your inbox to reset your password."
                            },
                            {
                                question: "How do I update my email address or phone number?",
                                answer: "You can update your contact information in the Account Information section of your settings."
                            },
                            {
                                question: "How can I check the status of my ticket bookings?",
                                answer: "You can view all your booking details and their current status in the Booking History section."
                            },
                            {
                                question: "How long is my ticket QR code valid for?",
                                answer: "Your ticket QR code is valid for 5 minutes after it was generated."
                            }
                        ].map((item, index) => (
                            <AccordionItem value={`item-${index + 1}`} className="dark:bg-tertiary dark:border-borderDark">
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center h-fit p-4 gap-2 border-[#b8cff5] rounded-lg shadow-none dark:bg-tertiary dark:border-borderDark">
                <Settings className="h-6 w-6 text-secondary" />
                <CardTitle>Support</CardTitle>
                <CardDescription>Get help and support from our team.</CardDescription>
            </Card>
        </div>
    )
}
