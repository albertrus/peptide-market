import type { Metadata } from 'next';
import './globals.css';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Peptide Vendor Marketplace',
  description: 'Compare peptide vendors, read reviews, and find the best prices.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 min-h-screen">
        <SessionProviderWrapper>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
