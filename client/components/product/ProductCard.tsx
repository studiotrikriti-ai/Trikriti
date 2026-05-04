"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Zap, ArrowRight } from "lucide-react";
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
      <Link
        href={`/products/${product._id}`}
        className="relative block aspect-square overflow-hidden bg-gray-50"
      >
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
          <div className="absolute top-2 right-2 bg-brand-black text-white text-xs px-1.5 py-0.5 flex items-center gap-0.5">
            <Zap size={9} />
            <span>Custom</span>
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
      <div className="flex flex-col flex-1 p-2 sm:p-4 gap-1.5 sm:gap-3">
        {/* Name */}
        <Link href={`/products/${product._id}`}>
          <h3 className="font-heading font-semibold text-xs sm:text-sm leading-snug hover:text-brand-red transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="font-heading font-bold text-sm sm:text-lg text-brand-red">
            ₹{product.discountedPrice.toLocaleString("en-IN")}
          </span>
          {product.discount > 0 && (
            <span className="text-gray-400 text-xs line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* CTA — desktop: full buttons, mobile: compact */}
        <div className="mt-auto">
          {product.isCustom ? (
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              {/* Mobile: icon-only cart, full customize */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                aria-label="Add to cart"
                className={`
                  sm:flex-1 flex items-center justify-center
                  w-full sm:w-auto
                  gap-1 py-2 sm:py-2.5
                  text-xs sm:text-sm font-semibold border-2 transition-all duration-200
                  ${product.inStock
                    ? "border-brand-black text-brand-black hover:bg-brand-black hover:text-white"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <ShoppingCart size={13} />
                <span>Add to Cart</span>
              </button>
              <Link
                href={`/products/${product._id}`}
                className="sm:flex-1 flex items-center justify-center gap-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-brand-black text-white hover:bg-brand-red transition-all duration-200"
              >
                <ArrowRight size={13} />
                <span>Customize</span>
              </Link>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
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
    </div>
  );
}
