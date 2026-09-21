'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ExternalLink from '@/components/ExternalLink';
import SaveButton from '@/components/SaveButton';
import Callout from '@/components/Callout';
import {
  getServerSnapshot,
  getSnapshot,
  hydrationStore,
  migrateLegacy,
  subscribe,
  SAVED_KIND_META,
  type SavedItem,
  type SavedKind,
} from '@/lib/saved';
import { getVendor } from '@/lib/vendors';

const ORDER: SavedKind[] = ['trial', 'paper', 'vendor'];

/**
 * Saved trials, papers and vendors.
 *
 * Replaces the vendor-only favorites page. Trials come first because a list of
 * studies to raise at an appointment is the most useful thing this site can
 * hand someone.
 */
export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    hydrationStore.subscribe,
    hydrationStore.getSnapshot,
    hydrationStore.getServerSnapshot,
  );

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // One-time move of anything saved under the old vendor-only key.
  useEffect(() => {
    migrateLegacy((id) => {
      const vendor = getVendor(id);
      return vendor ? { title: vendor.name, url: vendor.url } : undefined;
    });
  }, []);

  if (status === 'loading') {
    return (
      <div role="status" aria-live="polite" className="py-20 text-center">
        <span className="text-ink-muted">Loading your saved items...</span>
      </div>
    );
  }

  if (!session) return null;

  const grouped = ORDER.map((kind) => ({
    kind,
    meta: SAVED_KIND_META[kind],
    items: items
      .filter((i) => i.kind === kind)
      .slice()
      .sort((a, b) => b.savedAt - a.savedAt),
  }));

  const total = items.length;

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Saved
        </h1>
        <p className="prose-body mt-3 text-ink-muted">
          Trials, papers and vendors you have kept. Saved on this device only,
          so clearing your browser data clears this list.
        </p>
      </header>

      {hydrated && total === 0 ? (
        <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-ink">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            Use the Save button on any trial or paper to keep it here. A short
            list of specific studies is a much better thing to take to an
            appointment than a printout of a website.
          </p>
          <Link
            href="/conditions"
            className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Browse conditions
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ kind, meta, items: group }) => (
            <section key={kind} aria-labelledby={`saved-${kind}`}>
              <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-line pb-3">
                <h2
                  id={`saved-${kind}`}
                  className="text-xl font-semibold text-ink"
                >
                  {meta.plural}
                </h2>
                <span className="text-sm text-ink-subtle">
                  {group.length}{' '}
                  {group.length === 1
                    ? meta.singular.toLowerCase()
                    : meta.plural.toLowerCase()}
                </span>
              </div>

              {group.length === 0 ? (
                <p className="text-sm text-ink-subtle">{meta.emptyHint}</p>
              ) : (
                <ul className="space-y-2">
                  {group.map((item) => (
                    <SavedRow key={`${item.kind}:${item.id}`} item={item} />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {hydrated && total > 0 && (
        <Callout title="Taking this to an appointment">
          Registry IDs travel better than links. Every trial above has an NCT
          number and every paper a PMID, and a clinician can look either up
          directly.
        </Callout>
      )}
    </div>
  );
}

function SavedRow({ item }: { item: SavedItem }) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-line bg-surface p-4">
      <div className="min-w-0">
        <h3 className="font-sans text-sm font-medium leading-snug text-ink">
          <ExternalLink
            href={item.url}
            className="underline-offset-4 hover:underline"
          >
            {item.title}
          </ExternalLink>
        </h3>
        <p className="mt-1 text-xs text-ink-subtle">
          {item.kind === 'trial' && <span>{item.id}</span>}
          {item.kind === 'paper' && <span>PMID {item.id}</span>}
          {item.subtitle && (
            <>
              {item.kind !== 'vendor' && <span aria-hidden="true"> &middot; </span>}
              {item.subtitle}
            </>
          )}
        </p>
      </div>
      <SaveButton
        variant="labelled"
        item={{
          kind: item.kind,
          id: item.id,
          title: item.title,
          url: item.url,
          subtitle: item.subtitle,
        }}
      />
    </li>
  );
}
