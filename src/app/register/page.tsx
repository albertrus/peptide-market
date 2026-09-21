'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Create account.
 *
 * Still a mock: there is no user store behind this, and the form says so
 * instead of implying an account was created. Same accessibility corrections as
 * the sign-in page (associated labels, announced confirmation).
 */
export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fieldClass =
    'w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle';

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-8">
        <div
          role="status"
          className="rounded-xl border border-line bg-surface p-8 text-center"
        >
          <h1 className="text-xl font-semibold text-ink">
            Nothing was actually saved
          </h1>
          <p className="prose-body mx-auto mt-2.5 text-sm text-ink-muted">
            Registration is not wired up to a user store yet, so no account was
            created and nothing you typed was kept. Use the demo credentials on
            the sign-in page to try the saved-vendors feature.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="rounded-xl border border-line bg-surface p-8">
        <h1 className="text-2xl font-semibold text-ink">Create an account</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Save vendors so they are still there next time.
        </p>

        <p className="mt-5 rounded-md border border-notice-line bg-notice-soft px-4 py-3 text-xs text-notice-ink">
          This form is not connected to anything yet. Submitting it will not
          create an account, so do not enter a password you use elsewhere.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="register-name"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="register-password-hint"
              className={fieldClass}
            />
            <p id="register-password-hint" className="mt-1.5 text-xs text-ink-subtle">
              Not stored, not transmitted anywhere.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Create account
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-muted">
          Already have one?{' '}
          <Link
            href="/login"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
