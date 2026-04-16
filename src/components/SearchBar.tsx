"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Category, Vendor } from "@/lib/types";

interface Props {
  categories: Category[];
  vendors: Vendor[];
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchBar({ categories, vendors }: Props) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim();

  const matchedCategories = useMemo(() => {
    if (!trimmed) return [];
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        c.description.toLowerCase().includes(trimmed.toLowerCase())
    );
  }, [categories, trimmed]);

  const matchedVendors = useMemo(() => {
    if (!trimmed) return [];
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        v.description.toLowerCase().includes(trimmed.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(trimmed.toLowerCase()))
    );
  }, [vendors, trimmed]);

  const hasResults = matchedCategories.length > 0 || matchedVendors.length > 0;

  return (
    <div className="relative mb-10">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories or vendors…"
          aria-label="Search categories or vendors"
          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 bg-white
                     text-sm text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                     transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {trimmed && (
        <div className="absolute z-40 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {!hasResults && (
            <p className="px-4 py-3 text-sm text-gray-500">No results for &ldquo;{trimmed}&rdquo;</p>
          )}

          {matchedCategories.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Categories
              </p>
              {matchedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  <span className="text-xl flex-shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {highlight(cat.name, trimmed)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {highlight(cat.description, trimmed)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {matchedVendors.length > 0 && (
            <div className={matchedCategories.length > 0 ? "border-t border-gray-100" : ""}>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Vendors
              </p>
              {matchedVendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  href={`/vendor/${vendor.slug}`}
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  <span className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                    {vendor.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {highlight(vendor.name, trimmed)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {highlight(vendor.description, trimmed)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
