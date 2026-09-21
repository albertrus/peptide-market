import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Callout from '@/components/Callout';
import EvidenceBadge from '@/components/EvidenceBadge';
import CommunityPanel from '@/components/research/CommunityPanel';
import LiteraturePanel from '@/components/research/LiteraturePanel';
import TrialsPanel from '@/components/research/TrialsPanel';
import { SectionSkeleton } from '@/components/research/ResearchStates';
import { conditions, getCondition } from '@/lib/conditions';
import { getPeptide } from '@/lib/peptides';

/**
 * Condition hub. The main entry point into the site.
 *
 * Regenerated every six hours. The upstream registries update on a much slower
 * cadence than that, and the fetch layer caches on top, so this costs very
 * little while keeping recruitment status reasonably current.
 */
export const revalidate = 21600;

export function generateStaticParams() {
  return conditions.map((condition) => ({ slug: condition.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const condition = getCondition(slug);
  if (!condition) return { title: 'Condition not found' };

  return {
    title: condition.name,
    description: `Clinical trials and published research on peptides in the context of ${condition.name.toLowerCase()}, linked to ClinicalTrials.gov and PubMed.`,
  };
}

const JUMP_LINKS = [
  { href: '#trials', label: 'Open trials' },
  { href: '#literature', label: 'Literature' },
  { href: '#peptides', label: 'Peptides discussed' },
  { href: '#community', label: 'Community' },
];

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const condition = getCondition(slug);
  if (!condition) notFound();

  const trackedPeptides = condition.trackedPeptideIds
    .map(getPeptide)
    .filter((p) => p !== undefined);

  // The literature search is the intersection the site exists to surface:
  // this condition AND any of the peptides tracked for it.
  const peptideTerms = trackedPeptides
    .map((p) => p.literatureQuery)
    .join(' OR ');
  const literatureTerm = `${condition.queries.literatureCondition} AND (${peptideTerms})`;

  return (
    <div className="space-y-16">
      <header>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-subtle">
          <Link href="/conditions" className="hover:text-primary">
            Conditions
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-ink-muted">{condition.name}</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {condition.name}
        </h1>
        <p className="prose-body mt-3 text-lg text-ink-muted">
          {condition.summary}
        </p>

        {condition.overview.needsReview ? (
          <Callout
            tone="notice"
            title="Unreviewed placeholder copy"
            className="mt-6"
          >
            {condition.overview.body}
          </Callout>
        ) : (
          <p className="prose-body mt-6 text-ink-muted">
            {condition.overview.body}
          </p>
        )}

        <nav
          aria-label="On this page"
          className="mt-8 border-t border-line pt-5"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {JUMP_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-medium text-ink-muted underline-offset-4 hover:text-primary hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Suspense fallback={<SectionSkeleton rows={3} />}>
        <TrialsPanel
          id="trials"
          title="Trials open to enrolment"
          description={`Registered studies in ${condition.name.toLowerCase()} that are recruiting, about to recruit, or enrolling by invitation. Listing a trial is not a recommendation to join one.`}
          condition={condition.queries.trialCondition}
          pageSize={10}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton rows={3} />}>
        <LiteraturePanel
          id="literature"
          title="Published literature"
          description={`Papers indexed under ${condition.name.toLowerCase()} together with any of the peptides tracked below, newest first. Appearing here means the terms co-occur in PubMed, not that a paper found a benefit.`}
          term={literatureTerm}
          retmax={10}
        />
      </Suspense>

      <section aria-labelledby="peptides" className="scroll-mt-24">
        <div className="mb-5 border-b border-line pb-4">
          <h2 id="peptides" className="text-xl font-semibold text-ink sm:text-2xl">
            Peptides discussed in this context
          </h2>
          <p className="prose-body mt-1.5 text-sm text-ink-muted">
            These are the peptides people ask about in relation to{' '}
            {condition.name.toLowerCase()}. Inclusion means the intersection is
            being searched. It is not a claim that any of them treats anything.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {trackedPeptides.map((peptide) => (
            <li
              key={peptide.id}
              className="group relative rounded-lg border border-line bg-surface p-5 transition-all hover:border-line-strong hover:shadow-sm"
            >
              <div className="mb-2.5">
                <EvidenceBadge tier={peptide.evidenceTier} />
              </div>
              <h3 className="font-sans text-base font-semibold text-ink">
                <Link
                  href={`/peptides/${peptide.id}`}
                  className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
                >
                  {peptide.name}
                </Link>
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {peptide.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Suspense fallback={<SectionSkeleton rows={3} />}>
        <CommunityPanel
          id="community"
          subreddits={condition.queries.subreddits}
          term={trackedPeptides.map((p) => p.name).join(' OR ')}
          limit={6}
        />
      </Suspense>
    </div>
  );
}
