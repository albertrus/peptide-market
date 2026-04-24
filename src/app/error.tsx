"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="h-14 w-14 text-red-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        An unexpected error occurred. Please try again, or return to the home page.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700
                     text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200
                     text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
