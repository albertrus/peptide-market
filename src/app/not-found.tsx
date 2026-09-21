import Link from 'next/link';
import { conditions } from '@/lib/conditions';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">
        That page does not exist
      </h1>
      <p className="prose-body mx-auto mt-3 text-ink-muted">
        The link may be out of date. Everything on this site starts from a
        condition or a peptide.
      </p>

      <ul className="mt-8 flex flex-wrap justify-center gap-3">
        {conditions.map((condition) => (
          <li key={condition.slug}>
            <Link
              href={`/conditions/${condition.slug}`}
              className="inline-block rounded-md border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              {condition.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/peptides"
            className="inline-block rounded-md border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            All peptides
          </Link>
        </li>
      </ul>
    </div>
  );
}
