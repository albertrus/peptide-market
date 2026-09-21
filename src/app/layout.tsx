import type { Metadata } from 'next';
import './globals.css';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'PeptideEvidence',
    template: '%s | PeptideEvidence',
  },
  description:
    'Find the primary research on peptides yourself. Clinical trials and published literature, organised by condition, linked straight to the source.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {/*
          Skip link. First thing in the tab order so a keyboard user does not
          have to walk the whole navigation on every page.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>

        <SessionProviderWrapper>
          <Navbar />
          <main
            id="main"
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
          >
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
