'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { vendors, Vendor } from '@/lib/data';
import VendorCard from '@/components/VendorCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favoriteVendors, setFavoriteVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const favorites: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteVendors(vendors.filter((v) => favorites.includes(v.id)));
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="py-20 text-center text-gray-500 animate-pulse">Loading...</div>;
  }

  if (!session) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">Your saved peptide vendors.</p>
      </div>
      {favoriteVendors.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">Browse vendors and click the star icon to save them here.</p>
          <Link href="/vendors" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md transition-colors inline-block">
            Browse Vendors
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}
