import Link from 'next/link';
import { evidenceTierMeta, type EvidenceTier } from '@/lib/evidence';

interface EvidenceBadgeProps {
  tier: EvidenceTier;
  /** `sm` for dense lists and tables, `md` for headers. */
  size?: 'sm' | 'md';
  /** Renders the one-line summary next to the badge. */
  withSummary?: boolean;
  /** Links the badge to the methodology page. Off inside other links. */
  linkToMethodology?: boolean;
  className?: string;
}

/**
 * The evidence tier badge.
 *
 * It states what kind of study exists, never whether something works. Because
 * colour alone is not an accessible signal, the tier is always spelled out in
 * text and the badge carries its definition for screen readers.
 */
export default function EvidenceBadge({
  tier,
  size = 'sm',
  withSummary = false,
  linkToMethodology = false,
  className = '',
}: EvidenceBadgeProps) {
  const meta = evidenceTierMeta(tier);
  const sizing =
    size === 'md' ? 'text-sm px-3 py-1.5' : 'text-xs px-2.5 py-1';

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizing} ${meta.className}`}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-current opacity-70"
      />
      <span>
        <span className="sr-only">Evidence tier: </span>
        {meta.label}
      </span>
    </span>
  );

  const content = linkToMethodology ? (
    <Link
      href="/evidence"
      className="rounded-full transition-opacity hover:opacity-80"
      title={`${meta.label}. ${meta.summary} Read how tiers are assigned.`}
    >
      {badge}
    </Link>
  ) : (
    badge
  );

  if (!withSummary) {
    return <span className={className}>{content}</span>;
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 ${className}`}>
      {content}
      <span className="text-sm text-ink-muted">{meta.summary}</span>
    </span>
  );
}
