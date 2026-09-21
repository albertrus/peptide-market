import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Callout from '@/components/Callout';
import SearchForm from '@/components/SearchForm';
import LiteraturePanel from '@/components/research/LiteraturePanel';
import TrialsPanel from '@/components/research/TrialsPanel';
import { SectionSkeleton } from '@/components/research/ResearchStates';
import { conditions } from '@/lib/conditions';
import { peptides } from '@/lib/peptides';

export const metadata: Metadata = {
  title: 'Search research',
  description:
    'Search registered clinical trials and published literature across ClinicalTrials.gov and PubMed.',
};

/** Upstream query length cap, so a pathological URL cannot be forwarded on. */
const MAX_QUERY = 200;

function normalise(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (value ?? '').trim().slice(0, MAX_QUERY);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = normalise(params.q);

  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Search research
        </h1>
        <p className="prose-body mt-3 text-lg text-ink-muted">
          The two condition pages are curated. This searches the whole of
          ClinicalTrials.gov and PubMed, so you are not limited to what this
          site happens to track.
        </p>

        <div className="mt-6">
          <SearchForm defaultValue={query} autoFocus={!query} />
        </div>
      </header>

      {!query ? (
        <EmptyPrompt />
      ) : (
        <div className="space-y-16">
          <p className="text-sm text-ink-muted">
            Showing results for{' '}
            <span className="font-semibold text-ink">{query}</span>
          </p>

          <Suspense key={`trials:${query}`} fallback={<SectionSkeleton rows={3} />}>
            <TrialsPanel
              id="trials"
              title="Trials open to enrolment"
              description={`Registered studies matching "${query}" that are recruiting, about to recruit, or enrolling by invitation. Listing a trial is not a recommendation to join one.`}
              term={query}
              pageSize={10}
            />
          </Suspense>

          <Suspense
            key={`literature:${query}`}
            fallback={<SectionSkeleton rows={3} />}
          >
            <LiteraturePanel
              id="literature"
              title="Published literature"
              description={`Papers indexed under "${query}", newest first. A result means the terms match the index, not that a paper found a benefit.`}
              term={query}
              retmax={10}
            />
          </Suspense>

          <Callout title="Reading results you searched for yourself">
            These results are not filtered or curated by this site, and nothing
            here carries an evidence tier. Check what each study actually
            measured, in whom, and whether it finished, before drawing anything
            from it.
          </Callout>
        </div>
      )}
    </div>
  );
}

/** Suggestions, so an empty search box is not a dead end. */
function EmptyPrompt() {
  const examples = [
    ...conditions.map((c) => c.name.toLowerCase()),
    'endometriosis semaglutide',
    'adenomyosis pain',
    ...peptides.slice(0, 3).map((p) => p.name.toLowerCase()),
  ];

  return (
    <section aria-labelledby="examples" className="max-w-3xl">
      <h2 id="examples" className="text-lg font-semibold text-ink">
        Try one of these
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <li key={example}>
            <Link
              href={`/search?q=${encodeURIComponent(example)}`}
              className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-primary hover:text-primary"
            >
              {example}
            </Link>
          </li>
        ))}
      </ul>

      <p className="prose-body mt-6 text-sm text-ink-muted">
        Searching a condition on its own is usually the most useful thing to do
        first. Combining a condition and a drug narrows fast, and an empty
        result at that point tells you something worth knowing: that the
        intersection has not been studied much.
      </p>
    </section>
  );
}
