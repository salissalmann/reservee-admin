"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import EventLayout from "@/app/_components/_features/_events/event-layout";

// Dynamic imports with loading states
const QueriesSection = dynamic(() => import("./components/queries-section"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-full h-16" />
      ))}
    </div>
  ),
});

const FAQSection = dynamic(() => import("./components/faq-section"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-full h-16" />
      ))}
    </div>
  ),
});

// Enable edge runtime for optimal performance
export const runtime = "edge";

const QueriesPage = ({ params }: { params: { id: string } }) => {
  return (
    <EventLayout eventId={params?.id} isActive="queries">
      <div className="min-h-screen bg-white text-black dark:bg-tertiary mx-auto dark:text-white md:w-[95%]">
        {/* Queries Section */}
        <QueriesSection event_id={params?.id} />
        {/* FAQ Section */}
        <FAQSection event_id={params?.id} />
      </div>
    </EventLayout>
  );
};

export default QueriesPage;
