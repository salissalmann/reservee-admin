"use client";
import { Button } from "@/components/ui/button";
import {
  User,
  Menu,
  X,
  LanguagesIcon,
  Sun,
  Moon,
  BarChart,
  Settings,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "@/app/_utils/context-management/rtk/features/theme-slice";
import { useAuth } from "@/app/_providers/initial-load";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import { Building2, Calendar, Users } from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";
import { HelpCircle, Bell, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = ({
  forgetPassword,
  showSecondaryNav = true,
}: {
  forgetPassword?: boolean;
  showSecondaryNav?: boolean;
}) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { setTheme: setNextTheme } = useTheme();
  const dispatch = useDispatch();
  const { theme = "light" } = useSelector((state: any) => state.theme || {});
  const pathname = usePathname();
  const [callLanguage, setCallLanguage] = useState(false);

  // Function to handle language setting
  const handleLanguageSetting = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get("lang");
    if (lang) {
      setCallLanguage(true);
    }
  }, []);

  const removeUnwantedElements = useCallback((text: string) => {
    const unwantedElements = Array.from(
      document.querySelectorAll("a, .eapps-widget-toolbar")
    );
    unwantedElements.forEach((element) => {
      if (
        element.textContent?.includes(text) ||
        element.classList.contains("eapps-widget-toolbar")
      ) {
        element.remove();
      }
    });
  }, []);

  useEffect(() => {
    handleLanguageSetting();

    const removeTranslatorWidgetLink = () =>
      removeUnwantedElements("Free Website Translator Widget");
    const removeEappsWidgetToolbarPanel = () =>
      removeUnwantedElements(".eapps-widget-toolbar");

    removeTranslatorWidgetLink();
    removeEappsWidgetToolbarPanel();

    const observer = new MutationObserver(() => {
      removeTranslatorWidgetLink();
      removeEappsWidgetToolbarPanel();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [handleLanguageSetting, removeUnwantedElements]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const Logo = () => (
    <div
      className="flex items-center gap-2 justify-center text-xl md:text-3xl cursor-pointer"
      onClick={() => router.push("/")}
    >
      <p className="text-tertiary font-bold dark:text-white">get</p>
      <p className="text-primary font-bold">&gt;</p>
      <p className="text-tertiary font-bold dark:text-white">in</p>
    </div>
  );

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
    setNextTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const RoutesAndIcons = [
    {
      route: "/dashboard",
      icon: <DashboardIcon className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      route: "/events/all",
      icon: <Calendar className="w-5 h-5" />,
      label: "Events",
    },
    {
      route: "/select-organization",
      icon: <Building2 className="w-5 h-5" />,
      label: "Select Organization",
    },
    {
      route: "/organizations",
      icon: <Building2 className="w-5 h-5" />,
      label: "Organizations",
    },
    {
      route: "/settings/account",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  return (
    <nav className="w-full top-0 left-0 right-0 z-50">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between py-4 px-4 w-full ">
        <Logo />
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className="dark:bg-tertiary bg-white dark:text-white text-tertiary"
            onClick={handleThemeToggle}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          {!isAuthenticated ? (
            <Button
              variant="default"
              className="rounded-full text-white dark:text-black flex items-center justify-center gap-2"
              size="sm"
              onClick={() => router.push("/auth/register")}
            >
              <User className="w-4 h-4" />
              Register
            </Button>
          ) : (
            <Button
              variant="default"
              className="rounded-full text-white dark:text-black flex items-center justify-center gap-2"
              size="sm"
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
                router.push("/auth/login");
              }}
            >
              <User className="w-4 h-4" />
              Logout
            </Button>
          )}
          {!forgetPassword && (
            <Button variant="ghost" size="sm" onClick={toggleDrawer}>
              <Menu className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <Drawer
        placement="left"
        onClose={toggleDrawer}
        open={isDrawerOpen}
        width="100%"
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: "none" }}
        className="dark:bg-tertiary"
      >
        <div className="flex flex-col h-full ">
          <div className="flex justify-between items-center p-4">
            <Logo />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDrawer}
              className="rounded-full border border-gray-300 dark:border-borderDark p-2 hover:bg-gray-100 cursor-pointer transition-all duration-300 text-black dark:text-white"
            >
              <X className="w-4 h-4 dark:text-white text-black" />
            </Button>
          </div>

          <div className="flex flex-col items-start gap-6 mt-8 px-8 w-full">
            {isAuthenticated ? (
              RoutesAndIcons.filter(item => item.label !== "Organizations").map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start gap-2 cursor-pointer py-3 px-4 dark:text-white text-black rounded-full w-full border border-gray-300 dark:border-borderDark dark:bg-tertiary bg-white"
                  onClick={() => router.push(item.route)}
                >
                  {item.icon}
                  <p className="text-md font-medium">{item.label}</p>
                </div>
              ))
            ) : (
              <Button
                variant="outline"
                className="rounded-full w-full dark:text-white text-black border border-gray-300 dark:border-borderDark dark:bg-tertiary bg-white"
                size="lg"
                onClick={() => router.push("/auth/login")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </Drawer>

      {/* Desktop navigation */}
      <div
        className={`hidden md:flex items-center justify-between w-full  md:px-14 2xl:px-[12.5%] dark:bg-tertiary border-b dark:border-borderDark border-b-gray-100
        ${showSecondaryNav ? "" : "py-3"}
        `}
      >
        <Logo />
        {showSecondaryNav && (
          <div className="flex-grow flex items-center justify-center gap-x-8">
            {RoutesAndIcons.filter(item => {
              if (pathname === "/select-organization") {
                return item.label === "Select Organization";
              }
              return item.label !== "Organizations";
            }).map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center gap-2 cursor-pointer py-3 ${
                  pathname === item.route ? "border-b-2 border-primary" : "dark:text-white text-black"
                }`}
                onClick={() => router.push(item.route)}
              >
                {item.icon}
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 items-center">
          {!forgetPassword && (
            <>
              <Button
                size="icon"
                className="dark:bg-tertiary bg-white dark:text-white text-tertiary shadow-none dark:border dark:border-borderDark"
                onClick={handleThemeToggle}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <div
                className="dark:bg-tertiary bg-white dark:text-white text-tertiary cursor-pointer dark:border rounded-full !p-[0.6rem] shadow-sm transition-all duration-300 px-8 hover:bg-gray-100 hover:border-gray-300
                  shadow-none dark:border-borderDark
                "
                onClick={() => setCallLanguage(!callLanguage)}
              >
                <LanguagesIcon className="w-4 h-4" />
              </div>
              {callLanguage && (
                <>
                  <script
                    src="https://static.elfsight.com/platform/platform.js"
                    async
                  ></script>
                  <div
                    className="elfsight-app-0a47f9fd-4815-4556-b6ac-f309c465a027 border dark:border-borderDark rounded-full !p-[0.6rem] shadow-sm dark:!text-white text-black"
                    data-elfsight-app-lazy
                  ></div>
                </>
              )}
              {!isAuthenticated && (
                <Button
                  variant="default"
                  className="rounded-full text-black bg-white"
                  onClick={() => router.push("/auth/login")}
                  size="lg"
                >
                  Login
                </Button>
              )}
            </>
          )}
          {!isAuthenticated ? (
            <Button
              variant="default"
              className="rounded-full text-white gap-2"
              onClick={() => router.push("/auth/register")}
            >
              <User className="w-4 h-4" />
              Register
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {/* <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white hover:bg-gray-200 scale-105 transition-all duration-300 cursor-pointer shadow-none border border-gray-300 dark:border-borderDark dark:bg-tertiary"
                onClick={() => router.push("/help")}
              >
                <HelpCircle className="w-5 h-5" />
              </Button> */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white hover:bg-gray-200 scale-105 transition-all duration-300 cursor-pointer shadow-none dark:border dark:border-borderDark dark:bg-tertiary"
                onClick={() => router.push("/notifications")}
              >
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white hover:bg-gray-200 scale-105 transition-all duration-300 cursor-pointer shadow-none dark:border dark:border-borderDark dark:bg-tertiary"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    {user?.first_name + " " + user?.last_name}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/settings/account")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      logout();
                      toast.success("Logged out successfully");
                      router.push("/auth/login");
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
