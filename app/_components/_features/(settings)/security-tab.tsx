import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Lock, Pencil, Loader2 } from "lucide-react";
import { TabContentProps } from "@/app/_types/settings";
import { Input } from "@/components/ui/input";  


export const SecurityTabContent = ({ passwordManagement }: TabContentProps) => {
    const { 
        passwordForm, 
        showPassword, 
        isLoading, 
        handlePasswordChange, 
        setPasswordForm, 
        setShowPassword 
    } = passwordManagement

    return (
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
            <Card className="dark:bg-tertiary dark:border-borderDark">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Password & Security</CardTitle>
                    <Button variant="ghost" size="icon">
                        <Lock className="h-8 w-8" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-[20%_80%] gap-4">
                        <div className="text-left">
                            <div className="text-gray-700 dark:text-white">Change Password</div>
                        </div>
                        <div className="text-left">
                            <div className="text-gray-700 dark:text-white flex flex-col gap-4">
                                {[
                                    { 
                                        field: "oldPassword", 
                                        placeholder: "Enter your old password" 
                                    },
                                    { 
                                        field: "newPassword", 
                                        placeholder: "Enter your new password" 
                                    },
                                    { 
                                        field: "confirmPassword", 
                                        placeholder: "Confirm Password" 
                                    }
                                ].map((item) => (
                                    <div className="relative border border-gray-200 dark:border-borderDark rounded-full px-4 py-1 w-full md:w-[80%]">
                                        <Input 
                                            type={showPassword[item.field as keyof typeof showPassword] ? "text" : "password"}
                                            placeholder={item.placeholder}
                                            className="border-none ml-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                                            value={passwordForm[item.field as keyof typeof passwordForm]}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, [item.field]: e.target.value })}
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <Lock className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Eye 
                                                className="h-4 w-4 text-gray-500 cursor-pointer" 
                                                onClick={() => setShowPassword({ ...showPassword, [item.field as keyof typeof showPassword]: !showPassword[item.field as keyof typeof showPassword] })} 
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-start items-start">
                                    <Button 
                                        className="bg-tertiary text-white dark:bg-white dark:text-black rounded-full font-bold text-md px-8 py-1 hover:scale-105 transition-all duration-300" 
                                        onClick={handlePasswordChange} 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Pencil className="h-4 w-4 mr-2" />}
                                        {isLoading ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center h-fit p-4 gap-2 border-[#b8cff5] rounded-lg shadow-none dark:bg-tertiary dark:border-borderDark">
                <Lock className="h-6 w-6 text-secondary" />
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Update your password and security settings.</CardDescription>
            </Card>
        </div>
    )
}
