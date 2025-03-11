"use client";
import Link from "next/link";
import { useAuth } from "@/app/_providers/initial-load";

export default function AccessDenied() {
  const { allowedRoutes } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page. Please contact your
          administrator for access.
        </p>

        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Available routes:
          </p>
          <div className="flex flex-wrap gap-2">
            {allowedRoutes?.map((route) => (
              <Link
                key={route}
                href={route}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-lg transition-colors"
              >
                {route.replace(/^\/+/, "")}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
