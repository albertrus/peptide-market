import Link from "next/link";
import { Vendor } from "@/lib/types";
import { Star, FlaskConical, Truck } from "lucide-react";

interface Props {
  vendor: Vendor;
  /** Show a compact row style instead of a full card */
  compact?: boolean;
}

function StarRating({ rating, totalReviews }: { rating: number; totalReviews: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">
        {rating.toFixed(1)} ({totalReviews})
      </span>
    </span>
  );
}

export default function VendorCard({ vendor, compact = false }: Props) {
  if (compact) {
    return (
      <Link
        href={`/vendor/${vendor.slug}`}
        className="flex items-center justify-between py-3 px-4 min-h-[44px] rounded-lg hover:bg-gray-50
                   border border-transparent hover:border-gray-200 transition-all group"
      >
        <div>
          <span className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
            {vendor.name}
          </span>
          <div className="flex items-center gap-3 mt-0.5">
            <StarRating
              rating={vendor.metrics.overallRating}
              totalReviews={vendor.metrics.totalReviews}
            />
            <span className="text-xs text-gray-400">{vendor.metrics.purity} purity</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          {vendor.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/vendor/${vendor.slug}`}
      className="block bg-white rounded-xl border border-gray-200 p-5
                 hover:border-brand-400 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
            {vendor.name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{vendor.description}</p>
        </div>
        {vendor.metrics.overallRating >= 4.5 && (
          <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Top rated
          </span>
        )}
      </div>

      <div className="mt-3">
        <StarRating
          rating={vendor.metrics.overallRating}
          totalReviews={vendor.metrics.totalReviews}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <FlaskConical className="h-3.5 w-3.5 text-blue-500" />
          {vendor.metrics.labTesting}
        </span>
        <span className="flex items-center gap-1">
          <Truck className="h-3.5 w-3.5 text-purple-500" />
          {vendor.metrics.shipping}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {vendor.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
