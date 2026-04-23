'use client';
import { Vendor, VendorProduct } from '@/lib/data';
import { useSession } from 'next-auth/react';
import FavoriteButton from './FavoriteButton';

interface Props {
  vendors: Vendor[];
  vendorProducts: VendorProduct[];
}

export default function VendorComparisonTable({ vendors, vendorProducts }: Props) {
  const { data: session } = useSession();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-6 py-4">Vendor</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Quantity</th>
            <th className="px-6 py-4">Purity</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vendorProducts.map((vp) => {
            const vendor = vendors.find((v) => v.id === vp.vendorId);
            if (!vendor) return null;
            return (
              <tr key={vp.vendorId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{vendor.name}</span>
                    {session && <FavoriteButton vendorId={vendor.id} />}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-indigo-700">${vp.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-600">{vp.quantity}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">{vp.purity}</span>
                </td>
                <td className="px-6 py-4">
                  {vp.inStock ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">In Stock</span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Out of Stock</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={vendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors"
                  >
                    Buy →
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
