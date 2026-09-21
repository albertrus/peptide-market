'use client';

import { useSession } from 'next-auth/react';
import ExternalLink from './ExternalLink';
import SaveButton from './SaveButton';
import { getVendor, type VendorListing } from '@/lib/vendors';

/**
 * Vendor price comparison.
 *
 * Accessibility: a real `<caption>`, `scope` on every header, and a row header
 * per vendor so a screen reader announces "Peptide Sciences, Price, $42.50"
 * rather than a bare number. The horizontal scroll container is focusable and
 * labelled so keyboard users can reach it, which a plain `overflow-x-auto` div
 * does not allow.
 */
export default function VendorComparisonTable({
  listings,
  peptideName,
}: {
  listings: VendorListing[];
  peptideName: string;
}) {
  const { data: session } = useSession();
  const sorted = [...listings].sort((a, b) => a.price - b.price);

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-line bg-surface-sunken px-5 py-8 text-center text-sm text-ink-muted">
        No vendor listings recorded for {peptideName}.
      </p>
    );
  }

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Vendor listings for ${peptideName}, scrollable`}
      className="overflow-x-auto rounded-lg border border-line bg-surface"
    >
      <table className="w-full min-w-[42rem] text-left text-sm">
        <caption className="sr-only">
          Vendor listings for {peptideName}, sorted by price, lowest first.
          Prices are placeholder data and have not been verified.
        </caption>
        <thead className="border-b border-line bg-surface-sunken text-xs uppercase tracking-wide text-ink-muted">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">
              Vendor
            </th>
            <th scope="col" className="px-5 py-3.5 font-semibold">
              Price
            </th>
            <th scope="col" className="px-5 py-3.5 font-semibold">
              Size
            </th>
            <th scope="col" className="px-5 py-3.5 font-semibold">
              Stated purity
            </th>
            <th scope="col" className="px-5 py-3.5 font-semibold">
              Stock
            </th>
            <th scope="col" className="px-5 py-3.5 font-semibold">
              <span className="sr-only">Vendor website</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {sorted.map((listing) => {
            const vendor = getVendor(listing.vendorId);
            if (!vendor) return null;

            return (
              <tr key={listing.vendorId} className="hover:bg-surface-sunken/60">
                <th scope="row" className="px-5 py-4 font-medium text-ink">
                  <span className="flex items-center gap-2">
                    {vendor.name}
                    {vendor.affiliate && (
                      <span className="rounded-full border border-notice-line bg-notice-soft px-2 py-0.5 text-xs font-semibold text-notice-ink">
                        Affiliate
                      </span>
                    )}
                    {session && (
                      <SaveButton
                        item={{
                          kind: 'vendor',
                          id: vendor.id,
                          title: vendor.name,
                          url: vendor.url,
                        }}
                      />
                    )}
                  </span>
                </th>
                <td className="px-5 py-4 font-semibold text-ink">
                  ${listing.price.toFixed(2)}
                </td>
                <td className="px-5 py-4 text-ink-muted">{listing.quantity}</td>
                <td className="px-5 py-4 text-ink-muted">{listing.purity}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      listing.inStock
                        ? 'border-status-open-line bg-status-open-soft text-status-open-ink'
                        : 'border-status-closed-line bg-status-closed-soft text-status-closed-ink'
                    }`}
                  >
                    {listing.inStock ? 'In stock' : 'Out of stock'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <ExternalLink
                    href={vendor.url}
                    sponsored={vendor.affiliate}
                    srHint={
                      vendor.affiliate
                        ? 'affiliate link, opens in a new tab'
                        : 'opens in a new tab'
                    }
                    className="whitespace-nowrap rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    Visit site
                  </ExternalLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
