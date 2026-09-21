import Link from 'next/link';
import type { Condition } from '@/lib/conditions';

/**
 * Entry point card for a condition.
 *
 * Uses the stretched-link pattern: the whole card is clickable, but the only
 * focusable element is the heading link. Wrapping a card in an anchor would
 * swallow everything inside it into one enormous link label.
 */
export default function ConditionCard({ condition }: { condition: Condition }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-all hover:border-line-strong hover:shadow-md">
      <h3 className="text-xl font-semibold text-ink">
        <Link
          href={`/conditions/${condition.slug}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
        >
          {condition.name}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
        {condition.summary}
      </p>

      <p className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
        Open trials, literature and discussion
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          &rarr;
        </span>
      </p>
    </article>
  );
}
