import ExternalLink from '@/components/ExternalLink';
import { RESEARCH_SOURCE_META, type ResearchSource } from '@/lib/research';

interface ResearchSectionProps {
  id: string;
  title: string;
  /** Says what the list is and, where it matters, what it is not. */
  description: string;
  source: ResearchSource;
  /** Deep link to the same search on the source, so readers can verify it. */
  sourceUrl?: string;
  sourceLinkLabel?: string;
  /** Rendered at the right of the header, for example a result count. */
  meta?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Shared frame for every aggregated list on the site.
 *
 * The source is named in the header rather than in fine print. A reader should
 * never have to guess whether they are looking at a trial registry or a forum
 * thread.
 */
export default function ResearchSection({
  id,
  title,
  description,
  source,
  sourceUrl,
  sourceLinkLabel = 'View on source',
  meta,
  children,
}: ResearchSectionProps) {
  const sourceMeta = RESEARCH_SOURCE_META[source];

  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h2 id={id} className="text-xl font-semibold text-ink sm:text-2xl">
              {title}
            </h2>
            <span className="rounded-full border border-line bg-surface-sunken px-2.5 py-0.5 text-xs font-medium text-ink-muted">
              Source: {sourceMeta.name}
            </span>
          </div>
          <p className="prose-body text-sm text-ink-muted">{description}</p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
          {meta}
          {sourceUrl && (
            <ExternalLink
              href={sourceUrl}
              className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              {sourceLinkLabel}
            </ExternalLink>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
