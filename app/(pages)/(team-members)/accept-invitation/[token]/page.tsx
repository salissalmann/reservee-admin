"use client";
import { ValidateTeamInvitationAPI } from "@/app/_apis/team-invitation-api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const runtime = 'edge';

interface InvitationResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    invitation: {
      link_id: string;
    };
    user: any;
  };
  access_token?: string | null;
  refresh_token?: string | null;
}

const Page = ({ params }: { params: { token: string } }) => {
  const { token } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState<InvitationResponse | null>(null);

  const validateToken = async () => {
    setIsLoading(true);
    try {
      // Remove existing tokens to ensure clean state
      localStorage.removeItem("access_token");
      localStorage.removeItem("refreshToken");

      const response = await ValidateTeamInvitationAPI(token);
      // console.log("Response: ", response);
      setResponse(response);

      // Handle token and routing based on response
      if (response?.status) {
        const { invitation } = response?.data;

        // If no user exists (new user), redirect to login with token
        if (!response?.data?.user) {
          router.push(`/auth/register?token=${invitation.id}`);
          return;
        }

        // If access and refresh tokens exist, set them and route to organization selection
        if (response?.access_token && response?.refresh_token) {
          localStorage.setItem("access_token", response?.access_token);
          localStorage.setItem("refreshToken", response?.refresh_token);
          router.push("/select-organization");
          return;
        }
      }
    } catch (error: any) {
      setResponse(
        error.response?.data || {
          status: false,
          message: "Something went wrong. Please try again.",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        {response?.status ? (
          // Success State
          <div className="text-center">
            <div className="mb-4 text-green-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Invitation Accepted!
            </h2>
            <p className="text-gray-600">{response?.message}</p>
          </div>
        ) : (
          // Error State
          <div className="text-center">
            <div className="mb-4 text-red-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-6">
              {response?.message || "This invitation link is no longer valid."}
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Return Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
