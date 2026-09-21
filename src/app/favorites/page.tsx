'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import VendorCard from '@/components/VendorCard';
import {
  getServerSnapshot,
  getSnapshot,
  hydrationStore,
  subscribe,
} from '@/lib/favorites';
import { vendors } from '@/lib/vendors';

/**
 * Saved vendors.
 *
 * Reads the saved IDs straight from the shared store, so unsaving a vendor from
 * this page removes its card immediately instead of leaving a stale one behind.
 */
export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const savedIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    hydrationStore.subscribe,
    hydrationStore.getSnapshot,
    hydrationStore.getServerSnapshot,
  );

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div role="status" aria-live="polite" className="py-20 text-center">
        <span className="text-ink-muted">Loading your saved vendors...</span>
      </div>
    );
  }

  if (!session) return null;

  const saved = vendors.filter((vendor) => savedIds.includes(vendor.id));

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Saved vendors
        </h1>
        <p className="prose-body mt-3 text-ink-muted">
          Saved on this device only. Clearing your browser data clears this list.
        </p>
      </header>

      {hydrated && saved.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-ink">
            You have not saved any vendors yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Use the heart on any vendor to keep it here.
          </p>
          <Link
            href="/vendors"
            className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Browse the vendor directory
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((vendor) => (
            <li key={vendor.id}>
              <VendorCard vendor={vendor} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
