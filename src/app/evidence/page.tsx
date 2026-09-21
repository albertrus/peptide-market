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

      <section aria-labelledby="unrated">
        <h2 id="unrated" className="text-2xl font-semibold text-ink">
          Current ratings
        </h2>

        {unrated.length === 0 ? (
          <p className="prose-body mt-2 text-ink-muted">
            Every peptide on the site has been rated.
          </p>
        ) : (
          <>
            <p className="prose-body mt-2 text-ink-muted">
              {unrated.length} of {peptides.length} peptides have not been
              reviewed against the tiers yet. They are listed here rather than
              quietly shown as unrated on their own pages.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {unrated.map((peptide) => (
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
          </>
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
