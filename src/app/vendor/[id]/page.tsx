import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { vendors, products } from "@/lib/data";
import VendorMetrics from "@/components/VendorMetrics";
import RedditComments from "@/components/RedditComments";
import { ExternalLink, MessageSquare } from "lucide-react";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return vendors.map((v) => ({ id: v.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const vendor = vendors.find((v) => v.slug === params.id);
  if (!vendor) return {};
  return {
    title: vendor.name,
    description: vendor.description,
  };
}

export default function VendorPage({ params }: Props) {
  const vendor = vendors.find((v) => v.slug === params.id);
  if (!vendor) notFound();

  const vendorProducts = products.filter((p) => p.vendorIds.includes(vendor.id));
  const subreddit = process.env.NEXT_PUBLIC_REDDIT_SUBREDDIT ?? "peptidemarket";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{vendor.name}</span>
      </nav>

      {/* Vendor header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
            {vendor.location && vendor.established && (
              <p className="text-sm text-gray-400 mt-0.5">
                {vendor.location} · Est. {vendor.established}
              </p>
            )}
            <p className="text-gray-600 mt-2">{vendor.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {vendor.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {vendor.website && (
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
          >
            Visit website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Metrics */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Vendor metrics</h2>
        <VendorMetrics metrics={vendor.metrics} />
        <p className="text-xs text-gray-400 mt-2">
          * Metrics sourced from community data. More metrics coming soon.
        </p>
      </section>

      {/* Products */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Products offered</h2>
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {vendorProducts.map((p) => (
            <div key={p.id} className="px-4 py-3">
              <p className="font-medium text-gray-900 text-sm">{p.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reddit discussion */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-800">Community discussion</h2>
          <span className="text-xs text-gray-400">via r/{subreddit}</span>
        </div>

        {vendor.redditThreadId ? (
          <RedditComments threadId={vendor.redditThreadId} vendorName={vendor.name} />
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-sm text-orange-700 mb-3">
              No Reddit discussion thread linked yet for <strong>{vendor.name}</strong>.
            </p>
            <a
              href={`https://www.reddit.com/r/${subreddit}/submit?title=Vendor+Review%3A+${encodeURIComponent(vendor.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm bg-orange-500 hover:bg-orange-600
                         text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Start a discussion on Reddit <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
