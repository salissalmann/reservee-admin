import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TabContentProps } from "@/app/_types/settings";


const PreferencesTabContent = ({ theme, handleThemeToggle }: TabContentProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
            <Card className="dark:bg-tertiary dark:border-borderDark">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Preferences</CardTitle>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-8 w-8" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                            <SelectTrigger className="dark:bg-tertiary dark:border-borderDark">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">
                                    <span className="mr-2">🇬🇧</span> English
                                </SelectItem>
                                <SelectItem value="de">
                                    <span className="mr-2">🇩🇪</span> German
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Notifications</Label>
                        <div className="space-y-4">
                            {[
                                { id: "email-notifications", label: "Email Notifications" },
                                { id: "sms-notifications", label: "SMS Notifications" },
                                { id: "push-notifications", label: "Push Notifications" }
                            ].map((item) => (
                                <div className="flex items-center justify-between">
                                    <Label htmlFor={item.id} className="cursor-pointer dark:text-white">
                                        {item.label}
                                    </Label>
                                    <Switch id={item.id} className="dark:bg-black dark:border-borderDark" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Theme</Label>
                        <div className="flex items-center gap-4">
                            {[
                                { id: "light-mode", label: "Light Mode", checked: theme === "light" },
                                { id: "dark-mode", label: "Dark Mode", checked: theme === "dark" }
                            ].map((item) => (
                                <div className="flex items-center">
                                    <Label htmlFor={item.id} className="cursor-pointer mr-2">
                                        {item.label}
                                    </Label>
                                    <Switch
                                        id={item.id}
                                        className="dark:bg-black dark:border-borderDark"
                                        checked={item.checked}
                                        onCheckedChange={handleThemeToggle}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center h-fit p-4 gap-2 border-[#b8cff5] rounded-lg shadow-none dark:bg-tertiary dark:border-borderDark">
                <Settings className="h-6 w-6 text-secondary" />
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Update your preferences and settings.</CardDescription>
            </Card>
        </div>
    )
}

export default PreferencesTabContent;