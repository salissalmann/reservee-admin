"use client";

import * as React from "react";
import {
  LayoutGrid,
  Ticket,
  Map,
  BarChart3,
  DollarSign,
  MessageSquare,
  RotateCcw,
  Settings,
  ChevronLeft,
  Calendar,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

interface EventLayoutProps {
  children: React.ReactNode;
  eventName?: string;
  eventId: string;
  isActive?: string;
}

export default function EventLayout({
  children,
  eventName = "Vienna Jazz Nights 2025",
  eventId,
  isActive = "overview",
}: EventLayoutProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check for mobile device on component mount and window resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    // Check initial load
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup listener
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const router = useRouter();

  return (
    <div className="flex min-h-screen relative bg-white dark:bg-tertiary">
      {/* Sticky Sidebar */}
      <div
        className={cn(
          "sticky top-0 h-fit flex flex-col border border-primary/10 dark:border-borderDark bg-white dark:bg-tertiary transition-all duration-300",
          isMobile ? "w-[50px]" : isExpanded ? "w-[280px]" : "w-[80px]"
        )}
      >
        {/* Menu Items */}
        <div className="flex flex-1 flex-col bg-white dark:bg-tertiary">
          {/* Event Title */}
          <a
            href="#"
            className={cn(
              "flex items-center px-4 py-3 text-white bg-tertiary dark:bg-white dark:text-tertiary",
              isMobile
                ? "justify-center"
                : isExpanded
                ? "gap-3 justify-start"
                : "justify-center"
            )}
          >
            <Calendar className="h-6 w-6 shrink-0 text-[#FF4747]" />
            {!isMobile && isExpanded && (
              <span className="text-sm">{eventName}</span>
            )}
          </a>

          {/* Navigation Items */}
          {[
            {
              icon: LayoutGrid,
              label: "Overview",
              href: `/event/${eventId}`,
              isActive: isActive === "overview",
            },
            {
              icon: Ticket,
              label: "Tickets",
              href: `/tickets/${eventId}`,
              isActive: isActive === "tickets",
            },
            {
              icon: DollarSign,
              label: "Revenue",
              href: `/orders-view/${eventId}`,
              isActive: isActive === "revenue",
            },
            {
              icon: Camera,
              label: "Ticket Scanning",
              href: `/ticket-scanning/${eventId}`,
              isActive: isActive === "ticket-scanning",
            },
            {
              icon: Map,
              label: "Seatmap",
              href: `/seatmap/${eventId}`,
              isActive: isActive === "seatmap",
            },
            {
              icon: BarChart3,
              label: "Analytics",
              href: `/analytics/${eventId}`,
              isActive: isActive === "analytics",
            },
            {
              icon: MessageSquare,
              label: "Queries",
              href: `/queries/${eventId}`,
              isActive: isActive === "queries",
            },
            {
              icon: RotateCcw,
              label: "Refund Requests",
              href: `/refund-requests/${eventId}`,
              isActive: isActive === "refund-requests",
            },
            {
              icon: Settings,
              label: "Settings",
              href: `/edit-event/${eventId}`,
              isActive: isActive === "settings",
            },
          ].map((item, index) => (
            <button
              key={index}
              className={cn(
                "flex items-center border-b border-primary/10 dark:border-borderDark px-2 md:px-4 py-3 text-primary hover:bg-gray-50 dark:hover:bg-white/5",
                item.isActive && "bg-primary text-white hover:bg-primary/90",
                isMobile
                  ? "justify-center"
                  : isExpanded
                  ? "gap-3 justify-start"
                  : "justify-center"
              )}
              onClick={() => {
                router.push(item.href);
              }}
            >
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger>
                    <item.icon
                      className={cn(
                        "h-5 w-5 md:h-6 md:w-6 shrink-0",
                        item.isActive ? "text-white" : "text-[#FF4747]"
                      )}
                    />
                    {!isMobile && isExpanded && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          ))}
        </div>

        {/* Collapse/Expand Button - Hidden on mobile */}
        {!isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "mt-auto flex items-center px-4 py-3 text-white hover:bg-gray-50 dark:hover:bg-white/5",
              isExpanded ? "gap-3 justify-start" : "justify-center"
            )}
          >
            <ChevronLeft
              className={cn(
                "h-6 w-6 shrink-0 text-[#FF4747] transition-transform",
                isExpanded && "rotate-180"
              )}
            />
            {isExpanded && <span className="text-sm">Collapse</span>}
          </button>
        )}
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto bg-white dark:bg-tertiary">
        {/* Main Content Area */}
        <main className="p-2 md:p-6">{children}</main>
      </div>
    </div>
  );
}
