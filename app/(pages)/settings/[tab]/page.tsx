"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import Navigation from "@/app/_components/_layout-components/navigation"
import { useAuth } from "@/app/_providers/initial-load"
import useThemeManagement from "@/app/_hooks/(settings)/useThemeManagement";
import usePasswordManagement from "@/app/_hooks/(settings)/usePasswordManagement";
import AccountTabContent from "@/app/_components/_features/(settings)/account-content";
import { SETTINGS_TABS } from "@/app/_types/settings"
import { SecurityTabContent } from "@/app/_components/_features/(settings)/security-tab";
import PreferencesTabContent from "@/app/_components/_features/(settings)/preference";
import { BookingTabContent } from "@/app/_components/_features/(settings)/bookings";
import { SupportTabContent } from "@/app/_components/_features/(settings)/settings-page";

export const runtime = "edge";

export default function SettingsPage({ params }: { params: { tab: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const { theme, handleThemeToggle } = useThemeManagement()
    const passwordManagement = usePasswordManagement()

    const initialTab = Array.isArray(params.tab)
        ? params.tab[0]?.toString()
        : params.tab?.toString() || "account"
    const [selectedTab, setSelectedTab] = useState(initialTab)

    useEffect(() => {
        router.push(`/settings/${selectedTab}`, { scroll: false })
    }, [selectedTab, router])

    const renderTabContent = () => {
        const props = {
            user,
            theme,
            handleThemeToggle,
            passwordManagement
        }

        switch (selectedTab) {
            case "account":
                return <AccountTabContent {...props} />
            case "security":
                return <SecurityTabContent {...props} />
            case "preferences":
                return <PreferencesTabContent {...props} />
            // case "booking":
            //     return <BookingTabContent />
            // case "support":
            //     return <SupportTabContent />
            default:
                return null
        }
    }

    const [isNotLoggedInPopupOpen, setIsNotLoggedInPopupOpen] = useState(false);
    useEffect(() => {
        if (!user?.id) {
            setIsNotLoggedInPopupOpen(true);
        }
    }, [user]);

    return (
        <>
            {/* {isNotLoggedInPopupOpen && (
                <NotLoggedIn
                    isPopupOpen={isNotLoggedInPopupOpen}
                    setIsPopupOpen={setIsNotLoggedInPopupOpen}
                    canDismiss={false}
                    key="not-logged-in-popup"
                />
            )} */}

            <div className="bg-background dark:bg-tertiary p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center space-x-2 text-muted-foreground dark:text-white">
                        <span onClick={() => router.push("/")} className="cursor-pointer hover:text-primary transition-all duration-300">Home</span>
                        <ChevronRight className="h-4 w-4" />
                        <span>Settings</span>
                        <ChevronRight className="h-4 w-4" />
                        <span>{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</span>
                    </div>

                    <h1 className="text-3xl font-bold">Settings</h1>
 
                    <div className="flex flex-start items-center gap-2 flex-wrap">
                        {SETTINGS_TABS.map((tab: any) => (
                            <Button
                                key={tab.value}
                                className={`${selectedTab === tab.value
                                        ? "bg-black text-white hover:bg-black/90"
                                        : "dark:bg-tertiary dark:border dark:border-borderDark bg-[#EAF2FF] dark:text-white text-gray-600 hover:bg-[#EAF2FF]/80"
                                    } rounded-full font-bold shadow-none`}
                                onClick={() => setSelectedTab(tab.value)}
                            >
                                {tab.name}
                            </Button>
                        ))}
                    </div>

                    {renderTabContent()}
                </div>
            </div>
        </>
    )
}