"use client";

import { useEffect, useState } from "react";
import { productAPI } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { Palette, Upload, MessageSquare, Package } from "lucide-react";

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

const steps = [
  { icon: Palette, title: "Choose Product", desc: "Pick from our custom product range" },
  { icon: Upload, title: "Share Your Design", desc: "Upload image or describe your idea" },
  { icon: MessageSquare, title: "We Confirm", desc: "Our team reviews and confirms your order" },
  { icon: Package, title: "Delivered!", desc: "Your custom print arrives at your doorstep" },
];

export default function CustomPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI
      .getAll({ isCustom: "true" })
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Header */}
      <div className="bg-brand-black text-white py-16 px-4 sm:px-6 text-center">
        <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-3">Made To Order</p>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">Custom Printing</h1>
        <p className="text-gray-400 max-w-xl mx-auto font-body">
          Your creativity, our craftsmanship. Design personalized products that reflect your unique style.
        </p>
      </div>

      {/* How It Works */}
      <section className="bg-brand-gray py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-bold text-2xl text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="relative w-14 h-14 bg-white border-2 border-brand-red mx-auto mb-3 flex items-center justify-center">
                  <step.icon size={22} className="text-brand-red" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-red text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-gray-500 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-heading font-bold text-2xl mb-8">Custom Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
