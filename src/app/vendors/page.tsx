import type { Metadata } from 'next';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import Callout from '@/components/Callout';
import VendorCard from '@/components/VendorCard';
import { vendors } from '@/lib/vendors';

export const metadata: Metadata = {
  title: 'Vendors',
  description:
    'Research peptide suppliers listed on this site, with what each one says about itself and whether the link pays a commission.',
};

export default function VendorsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Vendor directory
        </h1>
        <p className="prose-body mt-3 text-lg text-ink-muted">
          Suppliers that sell the peptides tracked on this site. Listing a vendor
          is not a recommendation, and nothing here is a check on what is
          actually in a vial.
        </p>
      </header>

      <AffiliateDisclosure />

      <Callout tone="notice" title="No ratings, on purpose">
        This directory used to show star ratings and review counts. Those numbers
        were invented, because the site has never collected a review. They have
        been removed rather than fixed up. What is left is checkable: where a
        vendor ships from, what it says about itself, and whether the link pays a
        commission.
      </Callout>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            <VendorCard vendor={vendor} />
          </li>
        ))}
      </ul>
    </div>
  );
}
