import { RedditComment, RedditThread } from "./types";
import type { Vendor } from "./types";

const SUBREDDIT = process.env.NEXT_PUBLIC_REDDIT_SUBREDDIT ?? "peptidemarket";
const USER_AGENT = process.env.REDDIT_USER_AGENT ?? "PeptideMarketplace/1.0";

/** Parse a raw Reddit comment child into our RedditComment shape */
function parseComment(child: Record<string, unknown>): RedditComment | null {
  if (child.kind !== "t1") return null;
  const d = child.data as Record<string, unknown>;
  if (d.author === "[deleted]" || d.body === "[deleted]") return null;

  let replies: RedditComment[] = [];
  const rawReplies = d.replies as Record<string, unknown> | undefined;
  if (rawReplies && rawReplies.kind === "Listing") {
    const listing = rawReplies.data as Record<string, unknown>;
    const children = (listing.children as Array<Record<string, unknown>>) ?? [];
    replies = children
      .map(parseComment)
      .filter((c): c is RedditComment => c !== null);
  }

  return {
    id: String(d.id),
    author: String(d.author),
    body: String(d.body),
    score: Number(d.score),
    createdUtc: Number(d.created_utc),
    permalink: `https://www.reddit.com${String(d.permalink)}`,
    replies,
  };
}

/**
 * Server-side only: fetch a Reddit thread and its comments.
 * Returns null if the thread cannot be found or on network error.
 */
export async function fetchRedditThread(
  threadId: string
): Promise<RedditThread | null> {
  try {
    const url = `https://www.reddit.com/r/${SUBREDDIT}/comments/${threadId}.json?limit=50&depth=3`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      // Cache for 5 minutes in Next.js
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(json) || json.length < 2) return null;

    // First element: the post listing
    const postListing = json[0] as Record<string, unknown>;
    const postData = (
      (postListing.data as Record<string, unknown>)
        .children as Array<Record<string, unknown>>
    )[0].data as Record<string, unknown>;

    // Second element: comment listing
    const commentListing = json[1] as Record<string, unknown>;
    const commentChildren = (
      (commentListing.data as Record<string, unknown>)
        .children as Array<Record<string, unknown>>
    ) ?? [];

    const comments: RedditComment[] = commentChildren
      .map(parseComment)
      .filter((c): c is RedditComment => c !== null);

    return {
      id: String(postData.id),
      title: String(postData.title),
      score: Number(postData.score),
      numComments: Number(postData.num_comments),
      url: `https://www.reddit.com${String(postData.permalink)}`,
      selftext: String(postData.selftext ?? ""),
      comments,
    };
  } catch {
    return null;
  }
}

/**
 * Returns the full Reddit thread URL for a vendor, or null if no thread is linked.
 *
 * To wire up a real thread ID for a vendor:
 *   1. Create a post in r/${NEXT_PUBLIC_REDDIT_SUBREDDIT} for the vendor (e.g. "Vendor Review: Paradigm Peptides")
 *   2. Copy the post ID from the URL: reddit.com/r/<subreddit>/comments/<threadId>/...
 *   3. Set `redditThreadId: "<threadId>"` on the matching vendor object in src/lib/data.ts
 */
export function getRedditThreadUrl(vendor: Vendor): string | null {
  if (!vendor.redditThreadId) return null;
  return `https://www.reddit.com/r/${SUBREDDIT}/comments/${vendor.redditThreadId}/`;
}
