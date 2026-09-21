'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Route-level error boundary.
 *
 * The research panels handle their own upstream failures, so reaching this
 * means something unexpected broke. It says so plainly and offers a retry
 * rather than showing a stack trace to a patient.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="text-2xl font-semibold text-ink">
        Something went wrong on this page
      </h1>
      <p className="prose-body mx-auto mt-3 text-ink-muted">
        This is a fault on our side, not a problem with your search. The
        underlying research is still available directly at ClinicalTrials.gov and
        PubMed.
      </p>

      {error.digest && (
        <p className="mt-3 text-xs text-ink-subtle">
          Error reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
        >
          Back to the home page
        </Link>
      </div>
    </div>
  );
}
