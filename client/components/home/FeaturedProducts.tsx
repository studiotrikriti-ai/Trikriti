"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productAPI } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI
      .getAll({ isCustom: "false" })
      .then((res) => setProducts(res.data.products.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-2">
            Featured
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-black">
            Our Best Sellers
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-brand-black hover:text-brand-red transition-colors"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square skeleton rounded-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Link href="/products" className="btn-outline text-sm">
          View All Products
        </Link>
      </div>
    </section>
  );
}
