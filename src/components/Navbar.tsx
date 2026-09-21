'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { conditions } from '@/lib/conditions';

/**
 * Primary navigation.
 *
 * Condition-first: conditions come before peptides, which come before vendors.
 * The order is the information architecture, so it is worth keeping that way.
 *
 * Accessibility notes: the mobile toggle is a real button with aria-expanded
 * and aria-controls, the current page is marked with aria-current, and the menu
 * closes on Escape and on navigation so keyboard users are never trapped.
 */

const staticLinks = [
  { href: '/peptides', label: 'Peptides' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/evidence', label: 'How we rate evidence' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  /*
   * The menu is derived from the route it was opened on rather than being a
   * plain boolean closed by an effect. When the pathname changes, `open` turns
   * false on its own, so navigating from the menu closes it with no effect and
   * no cascading render.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const close = useCallback(() => setOpenedOn(null), []);

  // Escape closes the menu and returns focus to the control that opened it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const links = [
    ...conditions.map((c) => ({
      href: `/conditions/${c.slug}`,
      label: c.shortName,
    })),
    ...staticLinks,
    ...(session ? [{ href: '/saved', label: 'Saved' }] : []),
  ];

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-b border-line bg-surface">
      <nav aria-label="Main" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-lg font-semibold tracking-tight text-ink"
          >
            Peptide<span className="text-primary">Evidence</span>
          </Link>

          <ul className="hidden items-center gap-6 text-sm lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                  className={`transition-colors hover:text-primary ${
                    isCurrent(link.href)
                      ? 'font-semibold text-primary'
                      : 'text-ink-muted'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 text-sm lg:flex">
            {session ? (
              <>
                <span className="text-ink-subtle">
                  {session.user?.name ?? session.user?.email}
                </span>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-md border border-line px-3 py-1.5 font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-ink-muted transition-colors hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-3.5 py-2 font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpenedOn(pathname))}
            aria-expanded={open}
            aria-controls={menuId}
            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-muted lg:hidden"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {open && (
          <div id={menuId} className="border-t border-line py-4 lg:hidden">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link.href) ? 'page' : undefined}
                    className={`block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-surface-sunken ${
                      isCurrent(link.href)
                        ? 'font-semibold text-primary'
                        : 'text-ink-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line px-3 pt-4 text-sm">
              {session ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-md border border-line px-3 py-2 font-medium text-ink-muted"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/login" className="font-medium text-ink-muted">
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-primary px-3.5 py-2 font-medium text-white"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
