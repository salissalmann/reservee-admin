"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download } from "lucide-react";
  ;
import { useRouter } from "next/navigation";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import { useEffect, useState } from "react";
import { get_order_details } from "@/app/_apis/order-apis";
import { Order } from "@/app/_types/orders";
import {
  EventSidebar,
  EventSidebarBottom,
} from "@/app/_components/_features/tickets/event-sidebar";
import { GetCurrencyIcon } from "@/app/_components/_layout-components/currency-icons";
import Loader from "@/app/_components/_layout-components/loader";
import SeatQRCodeRow from "@/app/_components/_features/tickets/seat-qr-code-row";
import NormalQRCodeRow from "@/app/_components/_features/tickets/normal-tickets-view";

export const runtime = "edge";

export default function OrderDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const fetchOrder = async (firstTime: boolean = false) => {
    try {
      if (firstTime) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      const res = await get_order_details(id);
      if (res.statusCode === 200) {
        setOrder(res.data);
        //               console.log("res.data", res.data)
        const sortedQrCodes = res.data.qrCodes.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setQrCodeData(sortedQrCodes);
      } else {
        setError(res.message);
      }
    } catch (error) {
      axiosErrorHandler(error, "Failed to fetch orders");
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(true);
  }, [id]);

  if (initialLoading) {
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
      <div className="min-h-screen dark:bg-tertiary bg-white w-[90%] md:w-[75%] mx-auto relative">
        <div className="p-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-muted-foreground dark:text-white">
            <span
              onClick={() => router.back()}
              className="cursor-pointer hover:text-primary transition-all duration-300"
            >
              Back
            </span>
            <ChevronRight className="h-4 w-4" />
            <span>Order {id}</span>
          </div>
          <h1 className="text-2xl font-bold text-tertiary dark:text-white mb-8 mt-4">
            Order Details
          </h1>

          <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
            {/* Left Column */}
            <div className="space-y-6">
              {order && (
                <EventSidebar order={order} currency={order?.currency} />
              )}
              {order && <EventSidebarBottom order={order} />}
            </div>

            <div className="space-y-4 p-4">
              {order?.type === "seatmap" ? (
                <>
                  <div className="grid grid-cols-5 gap-4 p-4 text-gray-600 dark:text-white dark:border-borderDark font-bold">
                    <div>Ticket #</div>
                    <div>Area</div>
                    <div>Seat</div>
                    <div>Price</div>
                    <div>QR Code Status</div>
                  </div>
                  {order.seatMapDetails.map((seat) => (
                    <SeatQRCodeRow
                      key={seat.id}
                      seat={seat}
                      qrCodeData={qrCodeData.sort(
                        (a: any, b: any) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      )}
                      orderId={Number(order?.id)}
                      currency={order?.currency}
                    />
                  ))}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-5 gap-4 p-4 text-gray-600 dark:text-white dark:border-borderDark font-bold">
                    <div>Ticket ID</div>
                    <div>Area</div>
                    <div>QTY ID</div>
                    <div>Price</div>
                    <div>QR Code Status</div>
                  </div>
                  {order?.orderItems.flatMap((item, index) =>
                    Array(item.quantity)
                      .fill(item)
                      .map((ticket, qtyIndex) => {
                        return (
                          <NormalQRCodeRow
                            key={`${ticket.id}-${qtyIndex}`}
                            ticket={ticket}
                            qtyIndex={qtyIndex}
                            qrCodeData={qrCodeData}
                            orderId={Number(order?.id)}
                            currency={order?.currency}
                          />
                        );
                      })
                  )}
                </>
              )}

              {/* Summary and Actions */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-white">
                  <div className="text-gray-600 dark:text-white">
                    Total Tickets:
                  </div>
                  <div className="text-gray-500 dark:text-white">
                    {order?.items} Tickets
                  </div>
                  <div className="text-gray-600 dark:text-white">
                    Total Cost:
                  </div>
                  <div className="text-gray-500 dark:text-white flex items-center">
                    {GetCurrencyIcon(order?.currency ?? "EUR")}{" "}
                    {parseFloat(order?.total_amount ?? "0").toFixed(2)}
                  </div>
                  <div className="text-gray-600 dark:text-white">
                    Payment Method:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-zinc-800 dark:bg-white dark:text-black text-white rounded">
                      VISA
                    </span>
                    **** **** **** 1234
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <Button
                    variant="secondary"
                    className="bg-tertiary dark:bg-white dark:text-black text-white rounded-full flex items-center gap-2 px-4 py-2 font-bold hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-secondary dark:bg-white dark:text-black text-white rounded-full flex items-center gap-2 px-4 py-2 font-bold hover:bg-primary hover:text-white transition-all duration-300"
                    onClick={() => router.back()}
                  >
                    Back to Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
