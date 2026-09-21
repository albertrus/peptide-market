import Link from 'next/link';
import { hasAffiliateRelationships } from '@/lib/vendors';

/**
 * FTC affiliate disclosure.
 *
 * The FTC endorsement guides ask for a disclosure that is clear, conspicuous
 * and close to the link it applies to, not one buried in a footer or a terms
 * page. So this renders inline above vendor links, in plain language, before
 * the reader can click anything.
 *
 * `hasAffiliateRelationships` is read from the vendor data, so the wording stays
 * truthful automatically: while no vendor is flagged as an affiliate, the
 * disclosure says the site earns nothing today and states what will change.
 */
export default function AffiliateDisclosure({
  variant = 'inline',
}: {
  variant?: 'inline' | 'full';
}) {
  if (variant === 'full') {
    return (
      <div className="prose-body space-y-4 text-ink-muted">
        <p>
          <strong className="text-ink">
            Some links on this site are, or will become, affiliate links.
          </strong>{' '}
          If you follow one of those links to a vendor and buy something, this
          site may be paid a commission by that vendor. You pay the same price
          either way.
        </p>
        <p>
          {hasAffiliateRelationships
            ? 'Vendor links that pay a commission are marked "affiliate link" on the link itself, every time, not only here.'
            : 'No vendor listed on this site currently pays a commission. When that changes, every paying link will be marked "affiliate link" on the link itself, every time, not only on this page.'}
        </p>
        <p>
          A commission does not buy a listing, a ranking or a favourable
          description. Vendor listings are not ordered by what they pay, and no
          vendor has any say over the research this site aggregates. The trial
          and literature listings come from public registries and are not
          sponsored by anyone.
        </p>
        <p>
          This disclosure is made under the{' '}
          <a
            href="https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
          >
            FTC Endorsement Guides
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <aside
      aria-label="Affiliate disclosure"
      className="rounded-lg border border-notice-line bg-notice-soft px-4 py-3 text-sm leading-relaxed text-notice-ink"
    >
      <span className="font-semibold">Affiliate disclosure: </span>
      {hasAffiliateRelationships
        ? 'some vendor links on this page pay this site a commission if you buy. Those links are marked. Your price is the same either way, and paying a commission does not affect a vendor’s placement here.'
        : 'no vendor link on this page currently pays this site a commission. If that changes, the paying links will be marked as affiliate links.'}{' '}
      <Link href="/disclosures" className="font-medium underline underline-offset-4">
        Full disclosure
      </Link>
      .
    </aside>
  );
}
