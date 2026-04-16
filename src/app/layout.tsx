import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: {
    default: "Peptide Market – Research Peptide Vendor Directory",
    template: "%s | Peptide Market",
  },
  description:
    "Browse research peptide vendors by category. Compare ratings, lab testing, shipping, and read Reddit community reviews.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 text-gray-400 text-sm py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
            <p className="font-semibold text-white">Peptide Market</p>
            <p>
              For research purposes only. All compounds listed are intended for
              laboratory use. Not for human consumption.
            </p>
            <p>© {new Date().getFullYear()} Peptide Market. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
