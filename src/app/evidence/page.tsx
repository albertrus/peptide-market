import type { Metadata } from 'next';
import Link from 'next/link';
import Callout from '@/components/Callout';
import EvidenceBadge from '@/components/EvidenceBadge';
import { EVIDENCE_TIERS_BY_STRENGTH } from '@/lib/evidence';
import { peptides } from '@/lib/peptides';

export const metadata: Metadata = {
  title: 'How we rate evidence',
  description:
    'The evidence tiers used across this site, what each one means, and what they deliberately do not tell you.',
};

export default function EvidencePage() {
  const unrated = peptides.filter((p) => p.evidenceTier === 'unrated');
  const byTier = EVIDENCE_TIERS_BY_STRENGTH.map((tier) => ({
    tier,
    peptides: peptides.filter((p) => p.evidenceTier === tier.tier),
  })).filter((group) => group.peptides.length > 0);

  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          How we rate evidence
        </h1>
        <p className="prose-body mt-3 text-lg text-ink-muted">
          Every peptide on this site carries a tier. The tier describes the
          strongest kind of study that exists, and nothing else.
        </p>
      </header>

      <Callout tone="notice" title="What a tier does not tell you">
        A tier is not a score, a safety rating, or a recommendation.
        &ldquo;Human trial&rdquo; does not mean the trials were positive, large,
        or about your condition. A well-run trial that found nothing still counts
        as a human trial. Read the linked sources; that is what they are there
        for.
      </Callout>

      <section aria-labelledby="tiers">
        <h2 id="tiers" className="text-2xl font-semibold text-ink">
          The tiers
        </h2>
        <p className="prose-body mt-2 text-ink-muted">
          Listed strongest first.
        </p>

        <dl className="mt-6 space-y-4">
          {EVIDENCE_TIERS_BY_STRENGTH.map((tier) => (
            <div
              key={tier.tier}
              className="rounded-lg border border-line bg-surface p-5"
            >
              <dt className="mb-2.5">
                <EvidenceBadge tier={tier.tier} size="md" />
              </dt>
              <dd className="prose-body text-sm leading-relaxed text-ink-muted">
                {tier.definition}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="ratings">
        <h2 id="ratings" className="text-2xl font-semibold text-ink">
          Current ratings
        </h2>
        <p className="prose-body mt-2 text-ink-muted">
          Assigned in September 2026 from registered trial status on
          ClinicalTrials.gov and publication-type counts on PubMed. The test for
          a human trial rating was a completed, registered, controlled trial in
          people. A registration on its own is a statement of intent, not a
          result. Each peptide page gives the reasoning for its own rating.
        </p>

        <dl className="mt-6 space-y-4">
          {byTier.map(({ tier, peptides: group }) => (
            <div
              key={tier.tier}
              className="rounded-lg border border-line bg-surface p-5"
            >
              <dt className="mb-3 flex flex-wrap items-center gap-2">
                <EvidenceBadge tier={tier.tier} size="md" />
                <span className="text-sm text-ink-muted">{tier.summary}</span>
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.map((peptide) => (
                    <li key={peptide.id}>
                      <Link
                        href={`/peptides/${peptide.id}`}
                        className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-primary hover:text-primary"
                      >
                        {peptide.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        {unrated.length > 0 && (
          <p className="prose-body mt-4 text-sm text-ink-subtle">
            {unrated.length} of {peptides.length} peptides have not been
            reviewed yet.
          </p>
        )}
      </section>

      <section aria-labelledby="sources">
        <h2 id="sources" className="text-2xl font-semibold text-ink">
          Where the research comes from
        </h2>
        <div className="prose-body mt-3 space-y-3 text-ink-muted">
          <p>
            <strong className="text-ink">ClinicalTrials.gov</strong>{' '}
            is the U.S. National Library of Medicine registry of clinical
            studies. Trial listings on this site are pulled from its public API
            and show the sponsor&rsquo;s own registered description. A
            registration is not peer review: anyone running a study can
            register one.
          </p>
          <p>
            <strong className="text-ink">PubMed</strong> indexes biomedical
            literature. Literature listings are pulled from its public API,
            newest first. Being indexed means a paper was published in an indexed
            journal, not that it was a good paper.
          </p>
          <p>
            <strong className="text-ink">Reddit</strong> appears on this site as
            community discussion, kept separate from both of the above and
            labelled as not evidence everywhere it appears.
          </p>
          <p>
            Nothing on this site is sponsored by a vendor, and no vendor has any
            input into what research is shown. See{' '}
            <Link
              href="/disclosures"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              disclosures
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
