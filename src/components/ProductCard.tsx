import Link from 'next/link';
import { Product } from '@/lib/data';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100 cursor-pointer h-full flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full self-start mb-3">
          {product.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm flex-1">{product.description}</p>
        <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center gap-1">
          Compare vendors →
        </div>
      </div>
    </Link>
  );
}
