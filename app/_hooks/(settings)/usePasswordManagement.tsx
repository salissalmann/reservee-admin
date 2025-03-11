import { useState } from "react";
import { toast } from "react-hot-toast";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import { changePasswordAPI } from "@/app/_apis/auth-apis";

const usePasswordManagement = () => {
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    })

    const [isLoading, setIsLoading] = useState(false)

    const handlePasswordChange = async () => {
        setIsLoading(true)
        try {
            if (!passwordForm.oldPassword) {
                toast.error("Old password is required")
                return
            }
            if (!passwordForm.newPassword) {
                toast.error("New password is required")
                return
            }
            if (!passwordForm.confirmPassword) {
                toast.error("Confirm password is required")
                return
            }
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                toast.error("New password and confirm password do not match")
                return
            }

            const response = await changePasswordAPI({
                old_password: passwordForm.oldPassword,
                new_password: passwordForm.newPassword,
            })

            if (response.statusCode === 200) {
                toast.success("Password changed successfully")
            } else {
                toast.error("Failed to change password")
            }
        } catch (error) {   
            axiosErrorHandler(error, "Failed to change password")
        } finally {
            setIsLoading(false)
        }
    }

    return {
        passwordForm,
        showPassword,
        isLoading,
        handlePasswordChange,
        setPasswordForm,
        setShowPassword
    }
}


export default usePasswordManagement;