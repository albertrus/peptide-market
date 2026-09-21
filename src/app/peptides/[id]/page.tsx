import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import Callout from '@/components/Callout';
import EvidenceBadge from '@/components/EvidenceBadge';
import VendorComparisonTable from '@/components/VendorComparisonTable';
import CommunityPanel from '@/components/research/CommunityPanel';
import LiteraturePanel from '@/components/research/LiteraturePanel';
import TrialsPanel from '@/components/research/TrialsPanel';
import { SectionSkeleton } from '@/components/research/ResearchStates';
import { conditionsForPeptide } from '@/lib/conditions';
import { evidenceTierMeta } from '@/lib/evidence';
import { getPeptide, peptides } from '@/lib/peptides';
import { listingsForPeptide, PRICING_IS_PLACEHOLDER } from '@/lib/vendors';

export const revalidate = 21600;

export function generateStaticParams() {
  return peptides.map((peptide) => ({ id: peptide.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const peptide = getPeptide(id);
  if (!peptide) return { title: 'Peptide not found' };

  return {
    title: peptide.name,
    description: `${peptide.description} Registered trials and published literature for ${peptide.name}, linked to the source.`,
  };
}

export default async function PeptidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const peptide = getPeptide(id);
  if (!peptide) notFound();

  const relatedConditions = conditionsForPeptide(peptide.id);
  const listings = listingsForPeptide(peptide.id);
  const tierMeta = evidenceTierMeta(peptide.evidenceTier);

  return (
    <div className="space-y-16">
      <header>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-subtle">
          <Link href="/peptides" className="hover:text-primary">
            Peptides
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-ink-muted">{peptide.name}</span>
        </nav>

        <p className="text-sm font-medium text-ink-subtle">
          {peptide.className}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {peptide.name}
        </h1>

        <div className="mt-4">
          <EvidenceBadge
            tier={peptide.evidenceTier}
            size="md"
            withSummary
            linkToMethodology
          />
        </div>

        <p className="prose-body mt-5 text-lg text-ink-muted">
          {peptide.description}
        </p>

        {peptide.aliases.length > 0 && (
          <p className="mt-3 text-sm text-ink-subtle">
            Also indexed as: {peptide.aliases.join(', ')}
          </p>
        )}

        <Callout tone="notice" title="Regulatory status" className="mt-6">
          {peptide.regulatoryNote}
        </Callout>

        <p className="prose-body mt-4 text-sm text-ink-subtle">
          Evidence tier rationale: {peptide.evidenceNote} {tierMeta.definition}
        </p>

        {relatedConditions.length > 0 && (
          <div className="mt-6">
            <h2 className="font-sans text-sm font-semibold text-ink">
              Tracked under
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {relatedConditions.map((condition) => (
                <li key={condition.slug}>
                  <Link
                    href={`/conditions/${condition.slug}`}
                    className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    {condition.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <Suspense fallback={<SectionSkeleton rows={3} />}>
        <TrialsPanel
          id="trials"
          title="Trials open to enrolment"
          description={`Registered studies listing ${peptide.name} as an intervention that are recruiting, about to recruit, or enrolling by invitation. Trials cover many different conditions.`}
          intervention={peptide.trialQuery}
          pageSize={8}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton rows={3} />}>
        <LiteraturePanel
          id="literature"
          title="Published literature"
          description={`The newest papers indexed for ${peptide.name}, across every topic. Use a condition page for the narrower intersection.`}
          term={peptide.literatureQuery}
          retmax={10}
        />
      </Suspense>

      <section aria-labelledby="vendors" className="scroll-mt-24">
        <div className="mb-5 border-b border-line pb-4">
          <h2 id="vendors" className="text-xl font-semibold text-ink sm:text-2xl">
            Vendor listings
          </h2>
          <p className="prose-body mt-1.5 text-sm text-ink-muted">
            Where {peptide.name} is sold as a research chemical, sorted by price.
            A listing is not a recommendation, and purity figures are what the
            vendor states, not an independent measurement.
          </p>
        </div>

        <div className="space-y-4">
          <AffiliateDisclosure />

          {PRICING_IS_PLACEHOLDER && (
            <Callout tone="notice" title="Prices are placeholder data">
              The figures below were hand-entered and have never been checked
              against a live vendor page. Do not rely on them. They stay visible
              only so the comparison layout can be built against real markup.
            </Callout>
          )}

          <VendorComparisonTable
            listings={listings}
            peptideName={peptide.name}
          />
        </div>
      </section>

      <Suspense fallback={<SectionSkeleton rows={3} />}>
        <CommunityPanel
          id="community"
          subreddits={['Peptides']}
          term={peptide.name}
          limit={6}
        />
      </Suspense>
    </div>
  );
}
