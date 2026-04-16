"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, FlaskConical } from "lucide-react";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-600 text-lg">
          <FlaskConical className="h-5 w-5" />
          Peptide Market
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Categories
          </Link>
          <a
            href={`https://www.reddit.com/r/${process.env.NEXT_PUBLIC_REDDIT_SUBREDDIT ?? "peptidemarket"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-600 transition-colors"
          >
            Community ↗
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-3 text-sm font-medium text-gray-700">
          <Link href="/" className="block hover:text-brand-600" onClick={() => setOpen(false)}>
            Categories
          </Link>
          <a
            href={`https://www.reddit.com/r/${process.env.NEXT_PUBLIC_REDDIT_SUBREDDIT ?? "peptidemarket"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-brand-600"
          >
            Community ↗
          </a>
        </div>
      )}
    </nav>
  );
}
