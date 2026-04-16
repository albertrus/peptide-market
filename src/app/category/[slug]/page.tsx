import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { categories, products, vendors } from "@/lib/data";
import VendorCard from "@/components/VendorCard";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const catProducts = products.filter((p) => p.categorySlug === params.slug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{category.icon}</span>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        </div>
        <p className="text-gray-500">{category.description}</p>
      </div>

      {/* Products + vendors */}
      <div className="space-y-10">
        {catProducts.map((product) => {
          const productVendors = product.vendorIds
            .map((id) => vendors.find((v) => v.id === id))
            .filter(Boolean) as typeof vendors;

          return (
            <section key={product.id}>
              <div className="mb-3">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{product.description}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                {productVendors.length === 0 ? (
                  <p className="p-4 text-sm text-gray-400">No vendors listed yet.</p>
                ) : (
                  productVendors
                    .sort((a, b) => b.metrics.overallRating - a.metrics.overallRating)
                    .map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} compact />
                    ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
