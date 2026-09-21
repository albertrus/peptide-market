'use client';

/**
 * Saved items: trials, papers and vendors.
 *
 * This replaces the vendor-only favorites store. Saving a vendor was the least
 * useful thing on the site once it became a research directory. "Trials I want
 * to ask my doctor about" is the thing this audience actually needs to keep,
 * and it is the reason to have an account at all.
 *
 * Trials and papers are not in the site's static data, so the display fields
 * are stored alongside the identifier. That means a saved item still renders
 * after the upstream registry changes, and the list never has to hit the API
 * to draw itself.
 *
 * Exposed as an external store so components read it with
 * `useSyncExternalStore` rather than copying it into state inside an effect.
 */

const STORAGE_KEY = 'saved-items';
/** The old vendor-only key. Read once, then migrated. See `migrateLegacy`. */
const LEGACY_KEY = 'favorites';
const CHANGE_EVENT = 'saved:changed';

export type SavedKind = 'trial' | 'paper' | 'vendor';

export interface SavedItem {
  kind: SavedKind;
  /** NCT ID, PMID, or vendor id. Unique within a kind. */
  id: string;
  title: string;
  url: string;
  /** Sponsor, journal, or where a vendor ships from. */
  subtitle?: string;
  savedAt: number;
}

export const SAVED_KIND_META: Record<
  SavedKind,
  { singular: string; plural: string; emptyHint: string }
> = {
  trial: {
    singular: 'Trial',
    plural: 'Trials',
    emptyHint:
      'Save a trial from any condition or peptide page to keep it here. Useful for building a list to take to an appointment.',
  },
  paper: {
    singular: 'Paper',
    plural: 'Papers',
    emptyHint: 'Save a paper from any research section to keep it here.',
  },
  vendor: {
    singular: 'Vendor',
    plural: 'Vendors',
    emptyHint: 'Save a vendor from the directory to keep it here.',
  },
};

const EMPTY: readonly SavedItem[] = Object.freeze([]);
const listeners = new Set<() => void>();

// getSnapshot must return a stable reference until the data actually changes,
// otherwise useSyncExternalStore loops.
let cachedRaw: string | null = null;
let cachedValue: readonly SavedItem[] = EMPTY;

function isSavedItem(v: unknown): v is SavedItem {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    (o.kind === 'trial' || o.kind === 'paper' || o.kind === 'vendor') &&
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.url === 'string'
  );
}

function parse(raw: string | null): readonly SavedItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const items = parsed.filter(isSavedItem);
    return items.length > 0 ? Object.freeze(items) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private browsing or blocked site data. Saving is a convenience and must
    // never take the page down with it.
    return null;
  }
}

function writeAll(items: readonly SavedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* Storage unavailable. Nothing useful to do here. */
  }
  emit();
}

function emit(): void {
  for (const listener of listeners) listener();
}

function handleExternalChange(): void {
  emit();
}

/**
 * Moves anything saved under the old vendor-only `favorites` key into the new
 * store, once. Cheap insurance against silently dropping someone's saved list
 * on deploy. Vendor names are filled in by the caller, since this module does
 * not import the vendor data.
 */
export function migrateLegacy(
  resolveVendor: (id: string) => { title: string; url: string } | undefined,
): void {
  let legacyRaw: string | null = null;
  try {
    legacyRaw = localStorage.getItem(LEGACY_KEY);
  } catch {
    return;
  }
  if (!legacyRaw) return;

  try {
    const parsed: unknown = JSON.parse(legacyRaw);
    const ids = Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === 'string')
      : [];

    const existing = getSnapshot();
    const additions: SavedItem[] = [];
    for (const id of ids) {
      if (existing.some((i) => i.kind === 'vendor' && i.id === id)) continue;
      const vendor = resolveVendor(id);
      if (!vendor) continue;
      additions.push({
        kind: 'vendor',
        id,
        title: vendor.title,
        url: vendor.url,
        savedAt: Date.now(),
      });
    }
    if (additions.length > 0) writeAll([...existing, ...additions]);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* Malformed legacy value. Nothing worth recovering. */
  }
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

export function getSnapshot(): readonly SavedItem[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parse(raw);
  return cachedValue;
}

/** Nothing is saved on the server, so the server snapshot is always empty. */
export function getServerSnapshot(): readonly SavedItem[] {
  return EMPTY;
}

export function isSaved(items: readonly SavedItem[], kind: SavedKind, id: string): boolean {
  return items.some((i) => i.kind === kind && i.id === id);
}

export function toggleSaved(item: Omit<SavedItem, 'savedAt'>): void {
  const current = getSnapshot();
  const next = isSaved(current, item.kind, item.id)
    ? current.filter((i) => !(i.kind === item.kind && i.id === item.id))
    : [...current, { ...item, savedAt: Date.now() }];
  writeAll(next);
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
