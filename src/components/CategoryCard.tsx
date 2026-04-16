import Link from "next/link";
import { Category } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface Props {
  category: Category;
  productCount: number;
  vendorCount: number;
}

export default function CategoryCard({ category, productCount, vendorCount }: Props) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4
                 hover:border-brand-400 hover:shadow-md transition-all duration-200"
    >
      <span className="text-3xl flex-shrink-0">{category.icon}</span>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
          {category.name}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{category.description}</p>
        <p className="text-xs text-gray-400 mt-2">
          {productCount} product{productCount !== 1 ? "s" : ""} ·{" "}
          {vendorCount} vendor{vendorCount !== 1 ? "s" : ""}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-500 flex-shrink-0 mt-1 transition-colors" />
    </Link>
  );
}
