"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    
    // Show a user-friendly toast notification
    toast.error("An unexpected error occurred", {
      description: error.message || "Please try again later.",
      duration: 5000,
    });
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-full bg-red-100 p-3">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Something went wrong!
      </h2>
      <p className="text-gray-500 max-w-md">
        We apologize for the inconvenience. Our technical team has been automatically notified.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
