"use client";

import { useEffect, useState } from "react";
import { productAPI, adminAPI } from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";
import { ToggleLeft, ToggleRight, Save } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  discountedPrice: number;
  image: string;
  isCustom: boolean;
  inStock: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, { price: number; discount: number }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    productAPI.getAll()
      .then((res) => {
        const prods: Product[] = res.data.products;
        setProducts(prods);
        const initial: Record<string, { price: number; discount: number }> = {};
        prods.forEach((p) => { initial[p._id] = { price: p.price, discount: p.discount }; });
        setEdits(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: string) => {
    setSaving(id);
    try {
      const res = await adminAPI.updateProduct(id, edits[id]);
      setProducts((prev) => prev.map((p) => p._id === id ? res.data.product : p));
      toast.success("Product updated!");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSaving(null);
    }
  };

  const handleToggleStock = async (id: string, inStock: boolean) => {
    try {
      const res = await adminAPI.updateProduct(id, { inStock: !inStock });
      setProducts((prev) => prev.map((p) => p._id === id ? res.data.product : p));
      toast.success(`Product marked as ${!inStock ? "In Stock" : "Out of Stock"}`);
    } catch {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl">Products</h1>
        <p className="text-gray-400 text-sm mt-1">
          Update price, discount, and stock status. Products cannot be added or deleted here.
        </p>
      </div>

      

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 skeleton rounded-sm" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Image */}
              <div className="w-16 h-16 bg-gray-50 relative overflow-hidden shrink-0 rounded-sm">
                <Image
                  src={product.image || "https://placehold.co/64x64/f5f5f5/ccc?text=?"}
                  alt={product.name}
                  fill className="object-cover"
                />
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  {product.isCustom && (
                    <span className="text-[10px] bg-brand-red text-white px-1.5 py-0.5 shrink-0">Custom</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-mono">{product._id}</p>
              </div>

              {/* Price input */}
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={edits[product._id]?.price || product.price}
                    onChange={(e) => setEdits((prev) => ({
                      ...prev,
                      [product._id]: { ...prev[product._id], price: Number(e.target.value) }
                    }))}
                    className="w-24 border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                {/* Discount input */}
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min={0} max={100}
                    value={edits[product._id]?.discount ?? product.discount}
                    onChange={(e) => setEdits((prev) => ({
                      ...prev,
                      [product._id]: { ...prev[product._id], discount: Number(e.target.value) }
                    }))}
                    className="w-20 border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                {/* Discounted price preview */}
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">Final Price</label>
                  <div className="w-24 bg-gray-50 border border-gray-100 px-2 py-1.5 text-sm font-semibold text-brand-red">
                    ₹{Math.round((edits[product._id]?.price || product.price) * (1 - ((edits[product._id]?.discount ?? product.discount) / 100)))}
                  </div>
                </div>

                {/* Save button */}
                <button
                  onClick={() => handleSave(product._id)}
                  disabled={saving === product._id}
                  className="flex items-center gap-1.5 bg-brand-black text-white px-3 py-1.5 text-xs font-medium hover:bg-brand-red transition-colors disabled:opacity-50"
                >
                  <Save size={12} />
                  {saving === product._id ? "Saving..." : "Save"}
                </button>

                {/* Stock toggle */}
                <button
                  onClick={() => handleToggleStock(product._id, product.inStock)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 transition-colors ${
                    product.inStock
                      ? "bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600"
                      : "bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {product.inStock ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
