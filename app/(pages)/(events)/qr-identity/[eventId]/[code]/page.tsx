"use client";

import EventLayout from "@/app/_components/_features/_events/event-layout";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ValidateQRCode } from "@/app/_apis/tickets-apis";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";

export const runtime = "edge";

export default function QRIdentityPage({
  params,
}: {
  params: { eventId: string; code: string };
}) {
  const [loading, setLoading] = React.useState(false);
  const [verificationStatus, setVerificationStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleVerifyTicket = async () => {
    try {
      setLoading(true);
      setVerificationStatus("idle");

      const response = await ValidateQRCode(params.code);
      if (response.statusCode === 200) {
        setVerificationStatus("success");
        toast.success("Ticket is valid");
      } else {
        setVerificationStatus("error");
        setErrorMessage(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error verifying ticket:", error);
      setVerificationStatus("error");
      axiosErrorHandler(error, "Error occurred while verifying ticket");
      setErrorMessage("Error occurred while verifying ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      <EventLayout
        eventId={params.eventId}
        eventName="Ticket Verification"
        isActive="qr-identity"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6  flex flex-col items-center justify-center h-[50vh]"
        >
          <Card className="p-6 space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold">Ticket Verification</h2>
            <div className="text-lg font-mono bg-muted p-3 rounded">
              {params.code}
            </div>

            <Button
              onClick={handleVerifyTicket}
              disabled={loading || verificationStatus === "success"}
              className="w-full bg-primary text-white rounded-full shadow-2xl hover:scale-105 hover:shadow-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : verificationStatus === "success" ? (
                "Ticket Verified"
              ) : (
                "Verify Ticket"
              )}
            </Button>

            {verificationStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg ${
                  verificationStatus === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {verificationStatus === "success" ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Ticket verified successfully!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>{errorMessage}</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </EventLayout>
    </div>
  );
}
