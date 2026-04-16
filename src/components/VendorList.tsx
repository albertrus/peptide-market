"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/lib/types";
import VendorCard from "@/components/VendorCard";
import { ArrowUpDown } from "lucide-react";

type SortKey = "rating" | "purity" | "reviews" | "alpha";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Rating ↓" },
  { key: "purity", label: "Purity ↓" },
  { key: "reviews", label: "Reviews ↓" },
  { key: "alpha", label: "Alphabetical" },
];

const STORAGE_KEY = "vendor-sort";

function parsePurity(purity: string): number {
  return parseFloat(purity.replace(/[^0-9.]/g, "")) || 0;
}

function sortVendors(vendors: Vendor[], key: SortKey): Vendor[] {
  const sorted = [...vendors];
  switch (key) {
    case "rating":
      return sorted.sort((a, b) => b.metrics.overallRating - a.metrics.overallRating);
    case "purity":
      return sorted.sort(
        (a, b) => parsePurity(b.metrics.purity) - parsePurity(a.metrics.purity)
      );
    case "reviews":
      return sorted.sort((a, b) => b.metrics.totalReviews - a.metrics.totalReviews);
    case "alpha":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

interface Props {
  vendors: Vendor[];
}

export default function VendorList({ vendors }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SortKey | null;
      if (saved && SORT_OPTIONS.some((o) => o.key === saved)) {
        setSortKey(saved);
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, []);

  function handleSort(key: SortKey) {
    setSortKey(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // ignore
    }
  }

  const sorted = sortVendors(vendors, sortKey);

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-500 font-medium">Sort by:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleSort(opt.key)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors min-h-[28px] ${
              sortKey === opt.key
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-brand-400 hover:text-brand-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Vendor rows */}
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {sorted.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">No vendors listed yet.</p>
        ) : (
          sorted.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} compact />)
        )}
      </div>
    </div>
  );
}
