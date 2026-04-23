import { vendors } from '@/lib/data';
import VendorCard from '@/components/VendorCard';

export default function VendorsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Peptide Vendors</h1>
        <p className="text-gray-600">Browse and compare trusted research peptide suppliers.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
