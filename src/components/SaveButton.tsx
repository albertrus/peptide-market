'use client';

import { useSyncExternalStore } from 'react';
import {
  getServerSnapshot,
  getSnapshot,
  isSaved,
  subscribe,
  toggleSaved,
  type SavedItem,
} from '@/lib/saved';

interface SaveButtonProps {
  item: Omit<SavedItem, 'savedAt'>;
  /** `icon` for dense card corners, `labelled` where there is room for text. */
  variant?: 'icon' | 'labelled';
}

/**
 * Save a trial, paper or vendor.
 *
 * Reads the shared store rather than keeping its own copy, so every instance
 * on a page agrees about what is saved.
 *
 * Accessibility: the label names the thing being saved rather than repeating
 * "Save" ten times down a list of trials, and the on state is exposed with
 * aria-pressed rather than by colour alone.
 */
export default function SaveButton({ item, variant = 'icon' }: SaveButtonProps) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const saved = isSaved(items, item.kind, item.id);

  const label = saved
    ? `Remove ${item.title} from saved`
    : `Save ${item.title}`;

  if (variant === 'labelled') {
    return (
      <button
        type="button"
        onClick={() => toggleSaved(item)}
        aria-pressed={saved}
        aria-label={label}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
          saved
            ? 'border-accent bg-accent-soft text-accent-ink'
            : 'border-line text-ink-muted hover:border-accent hover:text-accent'
        }`}
      >
        <BookmarkIcon filled={saved} />
        <span aria-hidden="true">{saved ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleSaved(item)}
      aria-pressed={saved}
      aria-label={label}
      className={`shrink-0 rounded-md p-1.5 transition-colors ${
        saved ? 'text-accent hover:text-accent-ink' : 'text-ink-subtle hover:text-accent'
      }`}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3.75h10.5a1 1 0 0 1 1 1v15.5l-6.25-4-6.25 4V4.75a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}
