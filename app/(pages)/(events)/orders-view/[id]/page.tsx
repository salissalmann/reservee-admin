"use client";

import React, { useEffect, useState } from "react";
  ;
import { Toaster } from "react-hot-toast";
import EventLayout from "@/app/_components/_features/_events/event-layout";
import { getEventOrdersAPI } from "@/app/_apis/order-apis";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import Loader from "@/app/_components/_layout-components/loader";
import { EventDetails } from "@/app/_types/qr-types";
import OrdersOverview from "@/app/_components/_features/tickets/orders-overview";
export const runtime = "edge";

export default function OrdersViewPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [event_details, setEventDetails] = useState<EventDetails>({
    event_title: "",
    currency: "",
  });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await getEventOrdersAPI(params.id);
      if (response.statusCode === 200) {
        setOrders(response.data.orders);
        setEventDetails(response.data.event);
        setLoading(false);
      } else {
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError("Error fetching orders");
      axiosErrorHandler(error, "Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [params.id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <EventLayout eventId={params.id} isActive="revenue">
        <OrdersOverview
          event_details={event_details}
          orders={orders}
          eventId={params.id}
        />
      </EventLayout>
    </>
  );
}
