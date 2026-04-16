"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { RedditThread, RedditComment } from "@/lib/types";
import { ArrowUp, MessageSquare, ExternalLink } from "lucide-react";

function timeAgo(utcSeconds: number): string {
  const diff = Math.floor(Date.now() / 1000) - utcSeconds;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Comment({ comment, depth = 0 }: { comment: RedditComment; depth?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 2);

  const isDeep = depth >= 2;

  return (
    <div className={depth > 0 ? "ml-4 border-l-2 border-gray-100 pl-3 mt-2" : "mt-4"}>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium text-gray-700">u/{comment.author}</span>
        <span className="flex items-center gap-0.5">
          <ArrowUp className="h-3 w-3 text-orange-400" />
          {comment.score}
        </span>
        <span>{timeAgo(comment.createdUtc)}</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={collapsed ? "Expand comment" : "Collapse comment"}
        >
          {collapsed ? "[+]" : "[–]"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="mt-1 text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none
                          prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{comment.body}</ReactMarkdown>
          </div>
          {comment.replies.length > 0 && (
            <div>
              {isDeep && !showReplies ? (
                <button
                  onClick={() => setShowReplies(true)}
                  className="mt-1 text-xs text-brand-600 hover:underline"
                >
                  Show {comment.replies.length} more repl{comment.replies.length === 1 ? "y" : "ies"}
                </button>
              ) : (
                showReplies &&
                comment.replies.map((reply) => (
                  <Comment key={reply.id} comment={reply} depth={depth + 1} />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-4" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <div key={n} className="space-y-2">
          <div className="flex gap-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-8 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

interface Props {
  threadId: string;
  vendorName: string;
}

export default function RedditComments({ threadId, vendorName }: Props) {
  const [thread, setThread] = useState<RedditThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/reddit/${threadId}`);
        if (!res.ok) throw new Error("fetch failed");
        setThread(await res.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [threadId]);

  const subreddit = process.env.NEXT_PUBLIC_REDDIT_SUBREDDIT ?? "peptidemarket";

  if (loading) return <Skeleton />;

  if (error || !thread) {
    return (
      <div className="space-y-3 mt-4">
        <p className="text-sm text-gray-500">
          Could not load Reddit discussion. Check back later or{" "}
          <a
            href={`https://www.reddit.com/r/${subreddit}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 underline"
          >
            browse the subreddit
          </a>
          .
        </p>
        <a
          href={`https://www.reddit.com/r/${subreddit}/submit?title=Vendor+Review%3A+${encodeURIComponent(vendorName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                     text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Add your review on Reddit
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Thread summary */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
        <span className="flex items-center gap-1">
          <ArrowUp className="h-4 w-4 text-orange-400" />
          <strong>{thread.score}</strong> upvotes
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 text-blue-400" />
          <strong>{thread.numComments}</strong> comments
        </span>
        <a
          href={thread.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-brand-600 hover:underline text-xs"
        >
          View on Reddit <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Comments */}
      <div className="divide-y divide-gray-100">
        {thread.comments.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No comments yet.</p>
        ) : (
          thread.comments.map((c) => <Comment key={c.id} comment={c} />)
        )}
      </div>

      {/* CTA */}
      <a
        href={`${thread.url}#reply`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                   text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <MessageSquare className="h-4 w-4" />
        Add your review on Reddit
      </a>
    </div>
  );
}
