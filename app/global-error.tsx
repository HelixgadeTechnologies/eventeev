"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center bg-gray-50">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            A critical error occurred
          </h2>
          <p className="text-gray-500 max-w-md">
            The application encountered a fatal error and could not recover. Please refresh the page.
          </p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
