import ExternalLink from '@/components/ExternalLink';
import { RESEARCH_SOURCE_META, type ResearchError } from '@/lib/research';

/**
 * Error state for a research list.
 *
 * It names the source, says plainly that the list is incomplete rather than
 * empty, and always offers the direct link so a reader can still get to the
 * primary source. An aggregator that silently shows nothing when it cannot
 * reach a registry is worse than useless on a health site.
 */
export function ResearchErrorState({
  error,
  fallbackUrl,
}: {
  error: ResearchError;
  fallbackUrl?: string;
}) {
  const meta = RESEARCH_SOURCE_META[error.source];

  return (
    <div
      role="status"
      className="rounded-lg border border-status-stopped-line bg-status-stopped-soft px-5 py-6 text-status-stopped-ink"
    >
      <p className="font-semibold">Could not load results from {meta.name}</p>
      <p className="mt-1.5 max-w-prose text-sm">
        {error.message} This list is incomplete right now, not empty. Search{' '}
        {meta.name} directly to see the current results.
      </p>
      <ExternalLink
        href={fallbackUrl ?? meta.url}
        className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
      >
        Go to {meta.name}
      </ExternalLink>
    </div>
  );
}

/** Empty state. Distinct from the error state on purpose. */
export function ResearchEmptyState({
  message,
  fallbackUrl,
  fallbackLabel,
}: {
  message: string;
  fallbackUrl?: string;
  fallbackLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunken px-5 py-8 text-center">
      <p className="mx-auto max-w-prose text-sm text-ink-muted">{message}</p>
      {fallbackUrl && (
        <ExternalLink
          href={fallbackUrl}
          className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          {fallbackLabel ?? 'Search the source directly'}
        </ExternalLink>
      )}
    </div>
  );
}

/**
 * Loading skeleton used as the Suspense fallback while a source is fetched.
 * Announced politely so screen reader users are told something is coming.
 */
export function ResearchSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">Loading research results</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-lg border border-line bg-surface p-5"
        >
          <div className="mb-3 flex gap-2">
            <div className="h-5 w-24 animate-pulse rounded-full bg-surface-sunken" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-surface-sunken" />
          </div>
          <div className="h-4 w-11/12 animate-pulse rounded bg-surface-sunken" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-sunken" />
        </div>
      ))}
    </div>
  );
}

/** Header-level skeleton for a whole section, including its title row. */
export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-5">
      <div aria-hidden="true" className="border-b border-line pb-4">
        <div className="h-7 w-56 animate-pulse rounded bg-surface-sunken" />
        <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-surface-sunken" />
      </div>
      <ResearchSkeleton rows={rows} />
    </div>
  );
}
