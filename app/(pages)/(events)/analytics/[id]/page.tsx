"use client";
import React from "react";
import EventLayout from "@/app/_components/_features/_events/event-layout";
import Footer from "@/app/_components/_layout-components/footer";
import Navigation from "@/app/_components/_layout-components/navigation";
import { useEvent } from "@/app/_hooks/_events/get-event-by-id";
import { Toaster } from "react-hot-toast";
import {
  BarChart,
  CheckCircle,
  DollarSign,
  Info,
  Receipt,
  Ticket,
  Tickets,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Grid, Polygon } from "@/app/(pages)/(reservation-seat)/seatmap/types";
import { GetCurrencyIcon } from "@/app/_components/_layout-components/currency-icons";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import RevenuePieChart from "../../../../_components/_features/_analytics/revenue-pie-chart";
import { IEvent, TicketType } from "@/app/_types/event-types";
import SeatBookingPercentageTable from "../../../../_components/_features/_analytics/seat-booking-table";
import GenderDistributionPieChart from "../../../../_components/_features/_analytics/gender-distribution";
import AgeDistributionBarChart from "../../../../_components/_features/_analytics/age-distribution";
import DailyBookingTrends from "../../../../_components/_features/_analytics/daily-booking-trends";
import {
  calculateStatistics,
  TopStatistics,
  COLORS,
} from "@/app/_utils/analytics-utils";
import useOrders from "@/app/_hooks/_analytics/useGetOrderByEvent";
import useSeatmap from "@/app/_hooks/_analytics/useGetSeatmap";
import Loader from "@/app/_components/_layout-components/loader";
import { Order } from "@/app/_types/orders";
import RevenuePieChartNormal from "../../../../_components/_features/_analytics/revenue-pie-chart-normal";
import NormalBookingPercentageTable from "../../../../_components/_features/_analytics/normal-booking-table";
import GenderDistributionPieChartNormal from "../../../../_components/_features/_analytics/gender-distribution-normal";
import SeatmapSeatsTable from "../../../../_components/_features/_analytics/seatmap-seats-table";
import NormalSeatsTable from "../../../../_components/_features/_analytics/normal-seats-table";
import SeatMapAnalytics from "../../../../_components/_features/_analytics/seat-map-analytics";
import NormalAnalytics from "../../../../_components/_features/_analytics/normal-anaytics";

export const runtime = "edge";

const OverviewBox = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-primary p-4 md:p-6 gap-2 rounded-lg bg-white text-gray-700">
      {icon}
      <p className="text-xl font-bold">{title}</p>
      <p className="text-xl font-bold text-primary">{value}</p>
    </div>
  );
};

export default function Analytics({ params }: { params: { id: string } }) {
  const { id } = params;
  const { event, isLoading, error } = useEvent(id);
  const {
    orders,
    filteredOrders,
    filteredOrdersRegular,
    loading,
    DataFormattingForSeatMapEvents,
    DataFormattingForRegularEvents,
  } = useOrders(id);

  if (error)
    return (
      <div className="h-screen flex justify-center items-center">
        Error: {error}
      </div>
    );
  if (isLoading) return <Loader />;

  if (
    (!event?.tickets || event?.tickets.length <= 0) &&
    (!event?.venue_config ||
      event?.venue_config === "" ||
      event?.venue_config === null)
  ) {
    return (
      <>
        <Toaster />
        <EventLayout eventId={params.id} isActive="analytics">
          <div
            className={`min-h-screen flex flex-col gap-4 justify-center items-center bg-white text-black dark:bg-tertiary dark:text-white`}
          >
            <Info className="h-9 w-9 text-primary" />
            <h1 className="text-md font-bold">
              Sorry, We don't have enough data to show you the analytics for
              this event.
            </h1>
            <p className="text-sm text-gray-500">
              Please check back later or contact support if you believe this is
              an error.
            </p>
          </div>
        </EventLayout>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <EventLayout eventId={params.id} isActive="analytics">
        <div
          className={`min-h-screen bg-white text-black dark:bg-tertiary dark:text-white`}
        >
          {/* Header */}
          <header>
            <div className="flex flex-wrap items-center justify-between w-[90%] mx-auto border-b border-gray-200 dark:border-borderDark pb-4">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart className="h-8 w-8" /> Analytics
              </h1>
              <div className="flex flex-col md:flex-row items-center gap-4 md:mt-0 mt-4">
                <div className="hidden md:block">
                  <Select defaultValue="vienna-2025">
                    <SelectTrigger className="w-[200px] bg-white dark:bg-tertiary dark:border-borderDark border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vienna-2025">
                        {event?.event_title || "Event Title"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </header>

          {event?.venue_config && event?.venue_config !== "" ? (
            <SeatMapAnalytics
              event={event as IEvent}
              orders={orders}
              filteredOrders={filteredOrders}
              DataFormattingForSeatMapEvents={DataFormattingForSeatMapEvents}
            />
          ) : (
            <NormalAnalytics
              event={event as IEvent}
              orders={orders}
              filteredOrdersRegular={filteredOrdersRegular}
              DataFormattingForRegularEvents={DataFormattingForRegularEvents}
            />
          )}
        </div>
      </EventLayout>
    </>
  );
}
