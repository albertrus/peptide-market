// ─── Core domain types ───────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Emoji or icon identifier */
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  /** IDs of vendors who carry this product */
  vendorIds: string[];
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  website?: string;
  established?: number;
  location?: string;
  logo?: string;
  /** IDs of products this vendor carries */
  productIds: string[];
  /** Tags such as "US-based", "Lab tested", "Fast shipping" */
  tags: string[];
  metrics: VendorMetrics;
  /** Reddit thread ID in NEXT_PUBLIC_REDDIT_SUBREDDIT for community discussion */
  redditThreadId?: string;
}

/**
 * Quantitative and qualitative metrics shown on the vendor profile.
 * Add future metrics here — the UI will render whatever fields are present.
 */
export interface VendorMetrics {
  /** 0 – 5 aggregate score */
  overallRating: number;
  totalReviews: number;
  labTesting: "Third-party" | "In-house" | "None";
  /** e.g. "US Domestic Only", "International", "Both" */
  shipping: string;
  /** e.g. "98%+" */
  purity: string;
  /** e.g. "< 24 hours" */
  responseTime: string;
  /** Upvote score pulled from the Reddit discussion thread */
  redditScore?: number;

  // ── Placeholder metrics – wire up the actual values later ────────────────
  /** Average days from order to delivery */
  avgShippingDays?: number;
  /** Percentage of customers who reorder */
  reorderRate?: number;
  /** 1 (cheap) – 5 (premium) */
  priceCompetitiveness?: number;
  /** Number of distinct SKUs */
  productVariety?: number;
}

// ─── Reddit API types ────────────────────────────────────────────────────────

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  /** Net upvote score */
  score: number;
  /** Unix timestamp (seconds) */
  createdUtc: number;
  permalink: string;
  replies: RedditComment[];
}

export interface RedditThread {
  id: string;
  title: string;
  score: number;
  numComments: number;
  /** Full Reddit URL */
  url: string;
  selftext?: string;
  comments: RedditComment[];
}
