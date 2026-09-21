'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

/**
 * Sign in.
 *
 * Accessibility fixes from the previous version: labels are associated with
 * their inputs via htmlFor/id (they were floating `<label>` elements before, so
 * screen readers announced unlabelled fields), the error is announced with
 * role="alert" and wired up with aria-describedby, and the submit button
 * reports its busy state.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError('That email and password combination was not recognised.');
    } else {
      router.push('/');
    }
  };

  const fieldClass =
    'w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle';

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="rounded-xl border border-line bg-surface p-8">
        <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Signing in lets you save vendors to come back to.
        </p>

        <p className="mt-5 rounded-md border border-line bg-surface-sunken px-4 py-3 text-xs text-ink-muted">
          Demo account: <strong className="text-ink">alice@example.com</strong>{' '}
          with the password <strong className="text-ink">password</strong>.
          Accounts are mock data and are not stored anywhere.
        </p>

        {error && (
          <p
            id="login-error"
            role="alert"
            className="mt-4 rounded-md border border-status-stopped-line bg-status-stopped-soft px-4 py-3 text-sm text-status-stopped-ink"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={error ? 'login-error' : undefined}
              aria-invalid={error ? true : undefined}
              className={fieldClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={error ? 'login-error' : undefined}
              aria-invalid={error ? true : undefined}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-muted">
          No account?{' '}
          <Link
            href="/register"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
