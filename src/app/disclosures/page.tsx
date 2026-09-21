import type { Metadata } from 'next';
import Link from 'next/link';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Disclosures',
  description:
    'Affiliate disclosure, editorial independence, and what this site is not.',
};

export default function DisclosuresPage() {
  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Disclosures
        </h1>
        <p className="prose-body mt-3 text-lg text-ink-muted">
          How this site makes money, what that does and does not influence, and
          what it is not qualified to do.
        </p>
      </header>

      <section aria-labelledby="affiliate">
        <h2 id="affiliate" className="text-2xl font-semibold text-ink">
          Affiliate disclosure
        </h2>
        <div className="mt-4">
          <AffiliateDisclosure variant="full" />
        </div>
      </section>

      <section aria-labelledby="medical">
        <h2 id="medical" className="text-2xl font-semibold text-ink">
          Not medical advice
        </h2>
        <div className="prose-body mt-3 space-y-3 text-ink-muted">
          <p>
            This site is a directory of links to public research registries and
            journals. It is not written or reviewed by clinicians, it does not
            diagnose anything, and it does not tell you what to take.
          </p>
          <p>
            Most peptides listed here are not approved by the FDA for any use and
            are sold only as research chemicals. Research chemicals are not
            manufactured to the standards that apply to medicines, and what is in
            the vial is not independently verified by anyone on this site.
          </p>
          <p>
            If something you read here looks relevant, the useful next step is
            bringing the source to a clinician who knows your history.
          </p>
        </div>
      </section>

      <section aria-labelledby="independence">
        <h2 id="independence" className="text-2xl font-semibold text-ink">
          Editorial independence
        </h2>
        <div className="prose-body mt-3 space-y-3 text-ink-muted">
          <p>
            Trial and literature listings come from the public APIs of
            ClinicalTrials.gov and PubMed. They are not curated to favour any
            vendor, and no vendor can pay to appear in them or to be left out of
            them.
          </p>
          <p>
            Evidence tiers are assigned against published{' '}
            <Link
              href="/evidence"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              definitions
            </Link>
            , and the definitions are on the site so a reader can disagree with
            how a tier was applied.
          </p>
        </div>
      </section>

      <section aria-labelledby="data">
        <h2 id="data" className="text-2xl font-semibold text-ink">
          Known gaps in the data
        </h2>
        <div className="prose-body mt-3 space-y-3 text-ink-muted">
          <p>
            Being straight about what is not finished is part of the disclosure,
            not separate from it:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Vendor prices, purity figures and stock status are placeholder data
              that has never been verified against a live vendor page. They are
              labelled as such wherever they appear.
            </li>
            <li>
              Evidence tiers were assigned in September 2026 from registered
              trial status and publication-type counts. They are a judgement
              about a body of evidence, made by the site rather than by a
              clinician, and the underlying counts drift as new work is
              published.
            </li>
            <li>
              Condition overviews cite the World Health Organization and the
              National Institute of Environmental Health Sciences for the
              condition itself. They are not written or reviewed by a clinician.
            </li>
          </ul>
        </div>
      </section>

      <Callout tone="notice" title="Reporting a problem">
        If a listing is wrong, a link is dead, or a claim on this site is not
        supported by what it links to, that is worth fixing. Contact route to be
        added.
      </Callout>
    </div>
  );
}
