'use client';

/**
 * Saved vendors, backed by localStorage.
 *
 * Exposed as an external store so components can read it with
 * `useSyncExternalStore` instead of copying it into state inside an effect.
 * That is what the hook exists for: localStorage is an external system, and
 * reading it in an effect causes the cascading render the lint rule flags.
 *
 * It also fixes two real bugs in the previous version. Two save buttons for the
 * same vendor on one page used to disagree with each other, and the saved list
 * went stale when a vendor was unsaved from the saved page itself.
 */

const STORAGE_KEY = 'favorites';
const CHANGE_EVENT = 'favorites:changed';

/** Stable empty reference. Returning a fresh [] would loop the store. */
const EMPTY: readonly string[] = Object.freeze([]);

const listeners = new Set<() => void>();

// getSnapshot must return the same reference until the data actually changes,
// so the parsed value is memoised against the raw string it came from.
let cachedRaw: string | null = null;
let cachedValue: readonly string[] = EMPTY;

function parse(raw: string | null): readonly string[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const ids = parsed.filter((v): v is string => typeof v === 'string');
    return ids.length > 0 ? Object.freeze(ids) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private browsing or blocked site data. Saving is a convenience; it must
    // never take the page down with it.
    return null;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function handleExternalChange(): void {
  emit();
}

export function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    // 'storage' covers other tabs; the custom event covers this one.
    window.addEventListener('storage', handleExternalChange);
    window.addEventListener(CHANGE_EVENT, handleExternalChange);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('storage', handleExternalChange);
      window.removeEventListener(CHANGE_EVENT, handleExternalChange);
    }
  };
}

export function getSnapshot(): readonly string[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parse(raw);
  return cachedValue;
}

/** Nothing is saved on the server, so the server snapshot is always empty. */
export function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

export function toggleFavorite(vendorId: string): void {
  const current = getSnapshot();
  const next = current.includes(vendorId)
    ? current.filter((id) => id !== vendorId)
    : [...current, vendorId];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Storage unavailable. Nothing useful to do here. */
  }

  emit();
}

/**
 * True once the client has taken over from the server-rendered markup. Used to
 * avoid flashing an empty saved list before localStorage has been read.
 */
export const hydrationStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => true,
  getServerSnapshot: () => false,
};
