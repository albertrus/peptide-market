import Link from 'next/link';
import { conditions } from '@/lib/conditions';
import ExternalLink from './ExternalLink';

const sourceLinks = [
  { href: 'https://clinicaltrials.gov', label: 'ClinicalTrials.gov' },
  { href: 'https://pubmed.ncbi.nlm.nih.gov', label: 'PubMed' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-base font-semibold text-ink">
              Peptide<span className="text-primary">Evidence</span>
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
              Links to primary research on peptides, organised by condition, so
              you can read the sources yourself.
            </p>
          </div>

          <nav aria-labelledby="footer-conditions">
            <h2
              id="footer-conditions"
              className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle"
            >
              Conditions
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {conditions.map((condition) => (
                <li key={condition.slug}>
                  <Link
                    href={`/conditions/${condition.slug}`}
                    className="text-ink-muted transition-colors hover:text-primary"
                  >
                    {condition.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site">
            <h2
              id="footer-site"
              className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle"
            >
              This site
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/evidence"
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  How we rate evidence
                </Link>
              </li>
              <li>
                <Link
                  href="/peptides"
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  All peptides
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors"
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  Vendor directory
                </Link>
              </li>
              <li>
                <Link
                  href="/disclosures"
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  Disclosures
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-sources">
            <h2
              id="footer-sources"
              className="font-sans text-xs font-semibold uppercase tracking-wide text-ink-subtle"
            >
              Primary sources
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {sourceLinks.map((link) => (
                <li key={link.href}>
                  <ExternalLink
                    href={link.href}
                    className="text-ink-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="prose-body text-sm text-ink-muted">
            <strong className="text-ink">This is not medical advice.</strong>{' '}
            This site aggregates links to public research registries and
            journals. It does not tell you what to take, and nothing here is a
            substitute for talking to a clinician who knows your history. Most
            peptides listed are not approved for any use and are sold only as
            research chemicals.
          </p>
          <p className="mt-4 text-xs text-ink-subtle">
            Trial and literature data retrieved from ClinicalTrials.gov and
            PubMed, both public services of the U.S. National Institutes of
            Health. Neither endorses this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
