'use client';
import { useEffect, useState } from 'react';

interface RedditPost {
  id: string;
  title: string;
  score: number;
  url: string;
  permalink: string;
  num_comments: number;
  subreddit: string;
}

export default function RedditPosts({ productName }: { productName: string }) {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `https://www.reddit.com/r/Peptides/search.json?q=${encodeURIComponent(productName)}&limit=5&sort=relevance`,
          { headers: { 'User-Agent': 'PeptideMarket/1.0' } }
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const fetched: RedditPost[] = data.data.children.map((child: { data: RedditPost }) => child.data);
        setPosts(fetched);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [productName]);

  if (loading) return <div className="py-8 text-center text-gray-500 animate-pulse">Loading Reddit discussions...</div>;

  if (error || posts.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        No discussions found for {productName}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <a
          key={post.id}
          href={`https://reddit.com${post.permalink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-gray-900 font-medium text-sm leading-snug">{post.title}</h4>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                <span>r/{post.subreddit}</span>
                <span>💬 {post.num_comments} comments</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-xs font-bold text-indigo-600 bg-indigo-50 rounded-md px-2 py-1 min-w-[40px]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
              {post.score}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
