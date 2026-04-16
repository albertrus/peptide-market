import { products, vendors, vendorProducts } from '@/lib/data';
import VendorComparisonTable from '@/components/VendorComparisonTable';
import RedditPosts from '@/components/RedditPosts';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const productVendorData = vendorProducts.filter((vp) => vp.productId === product.id);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
          {product.category}
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">{product.name}</h1>
        <p className="text-gray-600 text-lg max-w-3xl">{product.description}</p>
      </div>

      {/* Vendor Comparison */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Vendor Comparison</h2>
          <p className="text-sm text-gray-500 mt-1">Compare prices and availability across vendors</p>
        </div>
        <VendorComparisonTable vendors={vendors} vendorProducts={productVendorData} />
      </div>

      {/* Reddit Discussions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-orange-500">Reddit</span> Discussions
          </h2>
          <p className="text-sm text-gray-500 mt-1">Community discussions about {product.name} from r/Peptides</p>
        </div>
        <div className="p-6">
          <RedditPosts productName={product.name} />
        </div>
      </div>
    </div>
  );
}
