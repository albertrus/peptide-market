import { products } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl text-white px-8 py-16 mb-12 text-center shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Peptide Vendor Marketplace</h1>
        <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto">
          Compare prices, purity, and availability from top research peptide vendors. Read real discussions from the peptide community.
        </p>
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
