import { err, ok, type ResearchResult, type ResearchSource } from './types';

/** How long a cached upstream response stays fresh, in seconds. */
export const CACHE_SECONDS = {
  /** Trial registries change slowly. Six hours is plenty. */
  trials: 60 * 60 * 6,
  /** PubMed indexes new articles daily. */
  literature: 60 * 60 * 12,
  /** Community threads move faster but are the least important surface. */
  community: 60 * 30,
  /** Reddit app-only tokens last about a day; refresh well inside that. */
  redditToken: 60 * 60,
} as const;

/** Upstream calls are cut off here so a slow registry cannot hang a render. */
const TIMEOUT_MS = 8_000;

/**
 * Both NIH APIs ask callers to identify themselves so they can contact you
 * about traffic rather than silently rate limiting. Override in the environment
 * once the site has a real domain and contact address.
 */
const USER_AGENT =
  process.env.RESEARCH_USER_AGENT ?? 'peptide-market/0.1 (research aggregator)';

/** Statuses worth trying again: rate limits and transient server faults. */
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

interface FetchJsonOptions {
  source: ResearchSource;
  /** Seconds before Next.js revalidates the cached response. */
  revalidate: number;
  /** Cache tags, so a single source can be purged with `revalidateTag`. */
  tags?: string[];
  /** Extra request headers, for example an OAuth bearer token. */
  headers?: Record<string, string>;
  /**
   * Extra attempts after a retryable failure. Defaults to 2.
   *
   * This matters at build time: `next build` prerenders pages across several
   * worker processes at once, and NCBI rate limits anonymous callers to three
   * requests a second. Without a retry the literature panel loses the race and
   * bakes an error state into the static HTML.
   */
  retries?: number;
}

function backoffMs(attempt: number): number {
  // 400ms, 800ms, 1600ms, plus jitter so parallel workers stop colliding.
  return 400 * 2 ** attempt + Math.random() * 250;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch JSON and return a typed result instead of throwing.
 *
 * Caching note: as of Next.js 16, `fetch` is uncached by default, so the
 * `cache: 'force-cache'` plus `next.revalidate` pair here is doing real work.
 * See node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md.
 */
export async function fetchJson<T>(
  url: string,
  { source, revalidate, tags, headers, retries = 2 }: FetchJsonOptions,
): Promise<ResearchResult<T>> {
  let lastError: ResearchResult<T> | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(backoffMs(attempt - 1));

    let response: Response;

    try {
      response = await fetch(url, {
        cache: 'force-cache',
        next: { revalidate, tags: tags ?? [source] },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          Accept: 'application/json',
          'User-Agent': USER_AGENT,
          ...headers,
        },
      });
    } catch (cause) {
      const timedOut =
        cause instanceof DOMException && cause.name === 'TimeoutError';
      lastError = err({
        source,
        kind: timedOut ? 'timeout' : 'network',
        message: timedOut
          ? `${source} did not respond within ${TIMEOUT_MS / 1000} seconds.`
          : `Could not reach ${source}.`,
      });
      continue;
    }

    if (!response.ok) {
      lastError = err({
        source,
        kind: 'http',
        message: `${source} returned HTTP ${response.status}.`,
      });
      if (RETRYABLE.has(response.status)) continue;
      return lastError;
    }

    // Some sources answer an unauthenticated request with an HTML login or
    // interstitial page and a 200 status. Catching that here produces a clearer
    // error than letting JSON.parse fail on "<!DOCTYPE html>".
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('json')) {
      return err({
        source,
        kind: 'parse',
        message: `${source} answered with ${contentType || 'an unknown content type'} instead of JSON, which usually means the request needs authentication.`,
      });
    }

    try {
      return ok((await response.json()) as T);
    } catch {
      return err({
        source,
        kind: 'parse',
        message: `${source} returned a response that could not be parsed.`,
      });
    }
  }

  return (
    lastError ??
    err({ source, kind: 'network', message: `Could not reach ${source}.` })
  );
}

/** Builds a URL with search params, skipping undefined values. */
export function buildUrl(
  base: string,
  params: Record<string, string | number | undefined>,
): string {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}
