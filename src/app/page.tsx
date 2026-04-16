import { categories, products, vendors } from "@/lib/data";
import CategoryCard from "@/components/CategoryCard";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Research Peptide Vendor Directory
        </h1>
        <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
          Compare vendors by product, lab testing, purity, and community reviews.
          Powered by Reddit discussions.
        </p>
      </div>

      {/* Category grid */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Browse by category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.categorySlug === cat.slug);
          const catVendorIds = new Set(catProducts.flatMap((p) => p.vendorIds));
          return (
            <CategoryCard
              key={cat.id}
              category={cat}
              productCount={catProducts.length}
              vendorCount={catVendorIds.size}
            />
          );
        })}
      </div>

      {/* Featured vendors */}
      <div className="mt-16">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Top-rated vendors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vendors
            .filter((v) => v.metrics.overallRating >= 4.5)
            .map((v) => (
              <div
                key={v.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{v.name}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    ★ {v.metrics.overallRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{v.description}</p>
                <a
                  href={`/vendor/${v.slug}`}
                  className="text-xs text-brand-600 font-medium hover:underline"
                >
                  View vendor →
                </a>
              </div>
            ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-16 text-xs text-gray-400 text-center">
        All information is for research purposes only. Peptide Market does not sell
        compounds and is not affiliated with any vendor.
      </p>
    </div>
  );
}
