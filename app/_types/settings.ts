import usePasswordManagement from "@/app/_hooks/(settings)/usePasswordManagement";

export const SETTINGS_TABS = [
    { name: "Account Information", value: "account" },
    { name: "Password & Security", value: "security" },
    { name: "Preferences", value: "preferences" },
    // { name: "Booking History", value: "booking" },
    // { name: "Support", value: "support" },
]

export interface TabContentProps {
    user: any
    theme: string
    handleThemeToggle: () => void
    passwordManagement: ReturnType<typeof usePasswordManagement>
}
