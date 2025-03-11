import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons"
import { CardDescription } from "@/components/ui/card";
import { calculateAge } from "@/app/_utils/settings-utils";
import { TabContentProps } from "@/app/_types/settings";


const AccountTabContent = ({ user }: TabContentProps) => {
    const router = useRouter()
    const age = user?.dob ? calculateAge(user.dob) : null

    return (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
            <Card className="dark:bg-tertiary dark:border-borderDark overflow-x-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Account Information</CardTitle>
                    <Button variant="ghost" size="icon">
                        <User className="h-8 w-8" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="grid grid-cols-3 items-center gap-2">
                            {[
                                { label: "Full Name", value: `${user?.first_name} ${user?.last_name}` },
                                { label: "Email", value: user?.email },
                                { label: "Phone Number", value: user?.phone_no },
                                { label: "Country", value: user?.country },
                                { label: "City", value: user?.city },
                                { label: "State", value: user?.state },
                                { label: "Age", value: age },
                                { label: "Gender", value: user?.gender ? user?.gender?.charAt(0).toUpperCase() + user?.gender.slice(1) : "Not Set" }
                            ].map((item, index) => (
                                <>
                                    <div className="text-gray-700 dark:text-white">{item.label}</div>
                                    <div className="text-gray-700 dark:text-white">{item.value}</div>
                                    <div></div>
                                </>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end items-end">
                        <Button className="bg-tertiary text-white dark:bg-white dark:text-black rounded-full font-bold text-md px-8 py-1 hover:scale-105 transition-all duration-300"
                            onClick={() => router.push("/profile")}
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Update
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center h-fit p-4 gap-2 border-[#b8cff5] rounded-lg shadow-none dark:bg-tertiary dark:border-borderDark">
                <PersonIcon className="h-6 w-6 text-secondary" />
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account information.</CardDescription>
            </Card>
        </div>
    )
}

export default AccountTabContent;