'use client';

import { useSyncExternalStore } from 'react';
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  toggleFavorite,
} from '@/lib/favorites';

/**
 * Save a vendor to the local saved list.
 *
 * Reads from the shared store rather than keeping its own copy, so every
 * instance of this button on a page agrees about what is saved.
 *
 * Accessibility: the label names the vendor instead of repeating "Add to
 * favorites" five times on one page, and the on state is exposed through
 * aria-pressed rather than colour alone.
 */
export default function FavoriteButton({
  vendorId,
  vendorName,
}: {
  vendorId: string;
  vendorName: string;
}) {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isFavorite = favorites.includes(vendorId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(vendorId)}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite ? `Remove ${vendorName} from saved` : `Save ${vendorName}`
      }
      className={`shrink-0 rounded-md p-1.5 transition-colors ${
        isFavorite
          ? 'text-accent hover:text-accent-ink'
          : 'text-ink-subtle hover:text-accent'
      }`}
    >
      <svg
        aria-hidden="true"
        className="size-5"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.6 3.5a5 5 0 0 0-5.6 1.2 5 5 0 0 0-8.5 3.6c0 4.5 5.9 8.2 8.5 10.7 2.6-2.5 8.5-6.2 8.5-10.7a5 5 0 0 0-2.9-4.8Z"
        />
      </svg>
    </button>
  );
}
