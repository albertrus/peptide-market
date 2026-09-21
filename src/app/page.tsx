import Link from 'next/link';
import Callout from '@/components/Callout';
import ConditionCard from '@/components/ConditionCard';
import EvidenceBadge from '@/components/EvidenceBadge';
import { conditions } from '@/lib/conditions';
import { EVIDENCE_TIERS_BY_STRENGTH } from '@/lib/evidence';

/**
 * Home page.
 *
 * Condition-first. A visitor picks what they are dealing with, and the site
 * takes them to trials and literature for it. Peptides are still here, one
 * level down, because they are no longer the way in.
 */
export default function Home() {
  return (
    <div className="space-y-20">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Primary sources, not opinions
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          Find the actual research. Read it yourself.
        </h1>
        <p className="prose-body mt-5 text-lg text-ink-muted">
          Registered clinical trials and published literature, pulled live from
          ClinicalTrials.gov and PubMed and organised by condition. Every entry
          links straight to the source so you can read it, take it to an
          appointment, or see for yourself that it says less than someone
          claimed.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/conditions/${conditions[0].slug}`}
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Start with {conditions[0].shortName.toLowerCase()}
          </Link>
          <Link
            href="/evidence"
            className="rounded-md border border-line-strong px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            How we rate evidence
          </Link>
        </div>
      </section>

      <section aria-labelledby="conditions-heading">
        <div className="mb-6">
          <h2 id="conditions-heading" className="text-2xl font-semibold text-ink">
            Start with a condition
          </h2>
          <p className="prose-body mt-2 text-ink-muted">
            Each condition page shows trials currently open to enrolment, the
            newest published literature, and what patient communities are
            discussing, clearly separated.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {conditions.map((condition) => (
            <ConditionCard key={condition.slug} condition={condition} />
          ))}
        </div>
      </section>

      <section aria-labelledby="tiers-heading">
        <div className="mb-6">
          <h2 id="tiers-heading" className="text-2xl font-semibold text-ink">
            Every peptide carries an evidence tier
          </h2>
          <p className="prose-body mt-2 text-ink-muted">
            The tier says what kind of study exists, not whether something
            works. &ldquo;Animal only&rdquo; and &ldquo;human trial&rdquo; are
            very different things, and a lot of marketing depends on you not
            noticing which one you are looking at.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EVIDENCE_TIERS_BY_STRENGTH.map((tier) => (
            <li
              key={tier.tier}
              className="rounded-lg border border-line bg-surface p-4"
            >
              <EvidenceBadge tier={tier.tier} />
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {tier.summary}
              </p>
            </li>
          ))}
        </ul>

        <Link
          href="/evidence"
          className="mt-5 inline-block text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          Read the full definitions
        </Link>
      </section>

      <Callout tone="notice" title="What this site is and is not">
        This is a directory of links to public research. It does not recommend
        anything, it is not medical advice, and most peptides listed here are not
        approved by the FDA for any use. If something here looks relevant to you,
        the next step is a clinician, not a checkout page.
      </Callout>
    </div>
  );
}
