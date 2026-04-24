import Link from "next/link";
import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <FlaskConical className="h-14 w-14 text-brand-300 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700
                   text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
