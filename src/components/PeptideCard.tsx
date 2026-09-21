import Link from 'next/link';
import EvidenceBadge from './EvidenceBadge';
import type { Peptide } from '@/lib/peptides';

export default function PeptideCard({ peptide }: { peptide: Peptide }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-all hover:border-line-strong hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {/* Not linked to the methodology page: a nested link inside the
            stretched-link card would be unreachable by keyboard. */}
        <EvidenceBadge tier={peptide.evidenceTier} />
        <span className="text-xs font-medium text-ink-subtle">
          {peptide.className}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-ink">
        <Link
          href={`/peptides/${peptide.id}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
        >
          {peptide.name}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
        {peptide.description}
      </p>

      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-subtle">
        {peptide.regulatoryNote}
      </p>
    </article>
  );
}
