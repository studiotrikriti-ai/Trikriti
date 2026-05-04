"use client";
import { useEffect, useState } from "react";
import { productAPI } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { Search } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  discountedPrice: number;
  description: string;
  whyLoveIt: string[];
  image: string;
  isCustom: boolean;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "instock" | "custom">("all");

  useEffect(() => {
    productAPI
      .getAll()
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "instock" && p.inStock) ||
      (filter === "custom" && p.isCustom);
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Page Header */}
      <div className="bg-brand-black text-white py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-2">
            Browse
          </p>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl">All Products</h1>
          <p className="text-gray-400 mt-2 font-body">
            {products.length} products available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "instock", "custom"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors capitalize ${
                  filter === f
                    ? "bg-brand-red text-white"
                    : "border border-gray-200 text-gray-600 hover:border-brand-red hover:text-brand-red"
                }`}
              >
                {f === "all" ? "All" : f === "instock" ? "In Stock" : "Custom"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-heading">No products found</p>
            <p className="text-gray-300 text-sm mt-1">
              Try a different search or filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
