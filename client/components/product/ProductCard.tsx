"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      discountedPrice: product.discountedPrice,
      quantity: 1,
      isCustom: product.isCustom,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card group flex flex-col">
      {/* Image */}
      <Link href={`/products/${product._id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-brand-red text-white text-xs font-bold px-1.5 py-0.5">
            -{product.discount}%
          </div>
        )}
        {product.isCustom && (
          <div className="absolute top-2 right-2 bg-brand-black text-white text-xs px-1.5 py-0.5 flex items-center gap-1">
            <Zap size={9} />
            <span className="hidden sm:inline">Custom</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-brand-black text-white text-xs font-bold px-2 py-1">
              OUT OF STOCK
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2 sm:p-4 gap-2 sm:gap-3">
        <div>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-heading font-semibold text-xs sm:text-base leading-snug hover:text-brand-red transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs mt-1 line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
          <span className="font-heading font-bold text-sm sm:text-xl text-brand-red">
            ₹{product.discountedPrice.toLocaleString("en-IN")}
          </span>
          {product.discount > 0 && (
            <span className="text-gray-400 text-xs line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Why Love It - hidden on mobile */}
        {product.whyLoveIt && product.whyLoveIt.length > 0 && (
          <ul className="space-y-1 hidden sm:block">
            {product.whyLoveIt.slice(0, 2).map((point, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                <CheckCircle size={11} className="text-brand-red shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        {product.isCustom ? (
          <div className="mt-auto flex gap-1 sm:gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs sm:text-sm font-semibold border-2 transition-all duration-200 ${
                product.inStock
                  ? "border-brand-black text-brand-black hover:bg-brand-black hover:text-white"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={12} />
              <span className="hidden sm:inline">Add</span>
            </button>
            <Link
              href={`/products/${product._id}`}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs sm:text-sm font-semibold bg-brand-black text-white hover:bg-brand-red transition-all duration-200"
            >
              <ArrowRight size={12} />
              <span>Customize</span>
            </Link>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`mt-auto flex items-center justify-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              product.inStock
                ? "bg-brand-black text-white hover:bg-brand-red"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={13} />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
