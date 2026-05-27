"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { productAPI, customOrderAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { CheckCircle, ShoppingCart, ArrowLeft, Zap, Truck, Store, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  discountedPrice: number;
  description: string;
  whyLoveIt: string[];
  image: string;
  images: string[];
  isCustom: boolean;
  inStock: boolean;
  category: string;
}

// ── Image Gallery with swipe support ──
function ImageGallery({ product }: { product: Product }) {
  // Build final image list: deduplicate images array + main image
  const allImages = (() => {
    const imgs = product.images?.length ? product.images : [product.image];
    // ensure main image is included and no duplicates
    const seen = new Set<string>();
    const result: string[] = [];
    [product.image, ...imgs].forEach((src) => {
      if (src && !seen.has(src)) { seen.add(src); result.push(src); }
    });
    return result;
  })();

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prev = () => setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square bg-gray-50 rounded-sm overflow-hidden select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={allImages[current] || "https://placehold.co/600x600/f5f5f5/ccc?text=Product"}
          alt={`${product.name} - image ${current + 1}`}
          fill
          className="object-cover transition-opacity duration-200"
          priority
        />

        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-brand-red text-white text-sm font-bold px-3 py-1 z-10">
            -{product.discount}% OFF
          </div>
        )}
        {product.isCustom && (
          <div className="absolute top-4 right-4 bg-brand-black text-white text-xs px-2 py-1 flex items-center gap-1 z-10">
            <Zap size={10} /> Custom
          </div>
        )}

        {/* Arrow buttons — only show if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow-md flex items-center justify-center rounded-full transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow-md flex items-center justify-center rounded-full transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-brand-red scale-110" : "bg-white/70"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — only show if multiple images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                i === current ? "border-brand-red" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const [mode, setMode] = useState<"cart" | "customize">("cart");

  // ── Custom inquiry form state ──
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "HOME_DELIVERY">("PICKUP");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

  useEffect(() => {
    if (id) {
      productAPI
        .getById(id as string)
        .then((res) => setProduct(res.data.product))
        .catch(() => router.push("/products"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="aspect-square skeleton rounded-sm" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => <div key={i} className="w-16 h-16 skeleton rounded-sm" />)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 skeleton rounded-sm" />
          <div className="h-4 skeleton rounded-sm w-1/2" />
          <div className="h-24 skeleton rounded-sm" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      discountedPrice: product.discountedPrice,
      quantity: qty,
      isCustom: false,
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDescription.trim()) {
      toast.error("Please describe what you want");
      return;
    }
    if (deliveryMethod === "HOME_DELIVERY" && (!line1 || !city || !stateName || !pincode)) {
      toast.error("Please fill in your complete delivery address");
      return;
    }
    setSubmitting(true);
    try {
      const res = await customOrderAPI.submitInquiry({
        customer: { name, email, phone },
        productId: product._id,
        customDescription,
        deliveryMethod,
        address:
          deliveryMethod === "HOME_DELIVERY"
            ? { line1, city, state: stateName, pincode }
            : undefined,
      });
      setSubmittedId(res.data.customOrderId);
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-heading font-bold text-2xl mb-2">Inquiry Received!</h1>
          <p className="text-gray-500 mb-4">
            We'll review your request and contact you within 24 hours with pricing.
          </p>
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 mb-6">
            <p className="text-xs text-gray-400 mb-1">Your Order ID — save this to track</p>
            <p className="font-mono font-bold text-xl text-brand-red">{submittedId}</p>
          </div>
          <Link href="/custom" className="btn-primary py-3 text-center block">
            Browse More Custom Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href={product.isCustom ? "/custom" : "/products"}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          {product.isCustom ? "Back to Custom Products" : "Back to Products"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Image Gallery ── */}
          <ImageGallery product={product} />

          {/* ── Info + Actions ── */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-brand-red text-xs font-bold tracking-widest uppercase mb-1">
                {product.category}
              </p>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading font-black text-4xl text-brand-red">
                ₹{product.discountedPrice.toLocaleString("en-IN")}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-gray-400 text-xl line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-0.5">
                    Save ₹{(product.price - product.discountedPrice).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {product.whyLoveIt?.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold mb-3">Why You'll Love It</h3>
                <ul className="space-y-2">
                  {product.whyLoveIt.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle size={15} className="text-brand-red shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── CUSTOM PRODUCT ── */}
            {product.isCustom ? (
              <div className="border-t border-gray-100 pt-4 space-y-4">
                {/* Tab toggle */}
                <div className="grid grid-cols-2 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setMode("cart")}
                    className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                      mode === "cart"
                        ? "bg-brand-black text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("customize")}
                    className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                      mode === "customize"
                        ? "bg-brand-red text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Zap size={14} /> Customize
                  </button>
                </div>

                {/* Cart mode */}
                {mode === "cart" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Order this product as-is at the listed price. No customization — ships standard.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Quantity:</span>
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">−</button>
                        <span className="w-12 text-center text-sm font-medium">{qty}</span>
                        <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">+</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                      <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                        {product.inStock ? "In Stock — Ready to Ship" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="flex gap-3 flex-col sm:flex-row">
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm border-2 transition-all ${
                          product.inStock
                            ? "border-brand-black text-brand-black hover:bg-brand-black hover:text-white"
                            : "border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={!product.inStock}
                        className={`flex-1 py-3 font-semibold text-sm transition-all ${
                          product.inStock ? "btn-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Customize mode */}
                {mode === "customize" && (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700">
                      <strong>Price quoted after review.</strong> Submit your request and we'll contact you with pricing within 24 hours.
                    </div>
                    <h3 className="font-heading font-semibold text-base">Your Details</h3>
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name *" className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red" />
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone *" className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red" />
                    </div>
                    <textarea required rows={3} value={customDescription} onChange={(e) => setCustomDescription(e.target.value)} placeholder="Describe your customization — name, colour, text, occasion, etc. *" className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red resize-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setDeliveryMethod("PICKUP")} className={`flex items-center gap-2 p-3 border-2 text-sm font-medium transition-colors ${deliveryMethod === "PICKUP" ? "border-brand-red bg-red-50 text-brand-red" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        <Store size={15} /> Pickup (Free)
                      </button>
                      <button type="button" onClick={() => setDeliveryMethod("HOME_DELIVERY")} className={`flex items-center gap-2 p-3 border-2 text-sm font-medium transition-colors ${deliveryMethod === "HOME_DELIVERY" ? "border-brand-red bg-red-50 text-brand-red" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        <Truck size={15} /> Delivery (₹94)
                      </button>
                    </div>
                    {deliveryMethod === "HOME_DELIVERY" && (
                      <div className="space-y-3 bg-gray-50 p-3 border border-gray-100">
                        <input required type="text" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Address Line 1 *" className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red bg-white" />
                        <div className="grid grid-cols-3 gap-3">
                          <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City *" className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red bg-white" />
                          <input required type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State *" className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red bg-white" />
                          <input required maxLength={6} type="text" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} placeholder="Pincode *" className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red bg-white" />
                        </div>
                      </div>
                    )}
                    <button type="submit" disabled={submitting} className="w-full btn-primary py-3 font-semibold text-sm disabled:opacity-50">
                      {submitting ? "Submitting..." : "Submit Inquiry →"}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* ── REGULAR PRODUCT ── */
              <>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-200">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">−</button>
                    <span className="w-12 text-center text-sm font-medium">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">+</button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                    {product.inStock ? "In Stock — Ready to Ship" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <button onClick={handleAddToCart} disabled={!product.inStock} className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm border-2 transition-all ${product.inStock ? "border-brand-black text-brand-black hover:bg-brand-black hover:text-white" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}>
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button onClick={handleBuyNow} disabled={!product.inStock} className={`flex-1 py-3 font-semibold text-sm transition-all ${product.inStock ? "btn-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                    Buy Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
