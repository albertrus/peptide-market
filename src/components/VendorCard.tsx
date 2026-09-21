'use client';

import { useSession } from 'next-auth/react';
import ExternalLink from './ExternalLink';
import FavoriteButton from './FavoriteButton';
import type { Vendor } from '@/lib/vendors';

/**
 * Vendor card.
 *
 * The star rating and review count are gone. The site has never collected a
 * review, so rendering "4.8 (1243 reviews)" was inventing social proof. What is
 * left is checkable: where they ship from, what they say about themselves
 * (attributed, not asserted), and whether the link pays a commission.
 */
export default function VendorCard({ vendor }: { vendor: Vendor }) {
  const { data: session } = useSession();

  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{vendor.name}</h3>
        {session && <FavoriteButton vendorId={vendor.id} vendorName={vendor.name} />}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {vendor.basedIn && (
          <span className="rounded-full border border-line bg-surface-sunken px-2.5 py-0.5 text-xs font-medium text-ink-muted">
            Ships from {vendor.basedIn}
          </span>
        )}
        {vendor.affiliate && (
          <span className="rounded-full border border-notice-line bg-notice-soft px-2.5 py-0.5 text-xs font-semibold text-notice-ink">
            Affiliate link
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
        {vendor.description}
      </p>

      <ExternalLink
        href={vendor.url}
        sponsored={vendor.affiliate}
        className="mt-5 inline-block rounded-md border border-line px-4 py-2 text-center text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
      >
        Visit {vendor.name}
      </ExternalLink>
    </article>
  );
}
