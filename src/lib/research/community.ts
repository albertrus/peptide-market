import { buildUrl, CACHE_SECONDS, fetchJson } from './http';
import { ok, type CommunityPost, type CommunitySearchResult, type ResearchResult } from './types';

/**
 * Community discussion.
 *
 * This is the one source on the site that is explicitly NOT evidence, and the
 * UI has to keep saying so. It is here because it is where patients actually
 * talk, not because a thread tells you whether something works.
 *
 * This moved from a client component to the server. The old version called
 * Reddit from the browser with a custom User-Agent header, which triggers a
 * CORS preflight that Reddit does not answer, so it failed for every real
 * visitor. Fetching here also keeps the request out of the client bundle and
 * lets the response be cached.
 */

const REDDIT = 'https://www.reddit.com';
const REDDIT_OAUTH = 'https://oauth.reddit.com';

/**
 * Reddit stopped serving its public `.json` endpoints to server-side clients:
 * an unauthenticated request now gets the HTML web app back with a 200 status.
 * So this module prefers an app-only OAuth token when credentials are present
 * and falls back to the public endpoint otherwise.
 *
 * To make the community section work, create a "script" app at
 * https://www.reddit.com/prefs/apps and set REDDIT_CLIENT_ID and
 * REDDIT_CLIENT_SECRET. Without them the section renders its unavailable state,
 * which is the honest outcome rather than a silently empty list.
 */
const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;

export const communityCredentialsConfigured = Boolean(CLIENT_ID && CLIENT_SECRET);

/**
 * App-only OAuth token. Reddit issues these for ~24 hours; the cache entry is
 * deliberately shorter so a revoked or rotated secret recovers on its own.
 */
async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) return null;

  try {
    const response = await fetch(`${REDDIT}/api/v1/access_token`, {
      method: 'POST',
      cache: 'force-cache',
      next: { revalidate: CACHE_SECONDS.redditToken, tags: ['reddit-token'] },
      signal: AbortSignal.timeout(8_000),
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) return null;
    const token = (await response.json()) as { access_token?: string };
    return token.access_token ?? null;
  } catch {
    return null;
  }
}

interface RawListing {
  data?: {
    children?: { data?: RawPost }[];
  };
}

interface RawPost {
  id?: string;
  title?: string;
  subreddit?: string;
  score?: number;
  num_comments?: number;
  created_utc?: number;
  permalink?: string;
  stickied?: boolean;
}

function toPost(raw: RawPost): CommunityPost | null {
  if (!raw.id || !raw.title || !raw.permalink) return null;
  return {
    id: raw.id,
    title: raw.title,
    subreddit: raw.subreddit ?? 'unknown',
    score: raw.score ?? 0,
    commentCount: raw.num_comments ?? 0,
    createdUtc: raw.created_utc ?? 0,
    url: `${REDDIT}${raw.permalink}`,
  };
}

export interface CommunityQuery {
  /** Subreddits searched together, for example ['Endo', 'endometriosis']. */
  subreddits: string[];
  term: string;
  limit?: number;
}

export async function searchCommunity({
  subreddits,
  term,
  limit = 6,
}: CommunityQuery): Promise<ResearchResult<CommunitySearchResult>> {
  const multi = subreddits.join('+');
  const token = await getAccessToken();
  const base = token ? REDDIT_OAUTH : REDDIT;

  const url = buildUrl(`${base}/r/${multi}/search${token ? '' : '.json'}`, {
    q: term,
    restrict_sr: '1',
    sort: 'relevance',
    t: 'year',
    limit,
  });

  const result = await fetchJson<RawListing>(url, {
    source: 'reddit',
    revalidate: CACHE_SECONDS.community,
    tags: ['reddit'],
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!result.ok) return result;

  const posts = (result.data.data?.children ?? [])
    .map((child) => child.data)
    .filter((p): p is RawPost => p !== undefined && !p.stickied)
    .map(toPost)
    .filter((p): p is CommunityPost => p !== null);

  return ok({ posts });
}

/** Deep link to the same search on Reddit, so readers can go see the source. */
export function communitySearchUrl({ subreddits, term }: CommunityQuery): string {
  return buildUrl(`${REDDIT}/r/${subreddits.join('+')}/search`, {
    q: term,
    restrict_sr: '1',
  });
}
