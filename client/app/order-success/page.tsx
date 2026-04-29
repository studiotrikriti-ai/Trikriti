"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Home, Loader2 } from "lucide-react";

// Separated into its own component because useSearchParams()
// must be inside a Suspense boundary in Next.js App Router.
// Without Suspense, useSearchParams() returns null and orderId never shows.
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-md w-full text-center py-16">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-50 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={36} className="text-green-500" />
      </div>

      <h1 className="font-heading font-bold text-3xl mb-3">Order Placed!</h1>
      <p className="text-gray-500 mb-6">
        Thank you for shopping with Trikriti Studio. We'll get your order ready soon!
      </p>

      {/* Order ID box */}
      {orderId ? (
        <div className="bg-brand-gray border border-gray-200 p-5 rounded-sm mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
          <p className="font-mono font-bold text-2xl text-brand-black tracking-wider">
            {orderId}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Save this ID to track your order anytime
          </p>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-sm mb-8">
          <p className="text-sm text-yellow-700">
            Your order was placed! Check your email for the order ID.
          </p>
        </div>
      )}

      {/* Delivery info */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm mb-8 text-left space-y-2">
        <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">What happens next?</p>
        <p className="text-xs text-blue-700">
          📦 We'll review your order and UPI payment within a few hours.
        </p>
        <p className="text-xs text-blue-700">
          🚚 Your order will be dispatched within 1–2 business days.
        </p>
        <p className="text-xs text-blue-700">
          📍 Delivered in 4–5 business days from Pune.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <Link
          href={orderId ? `/track-order?orderId=${orderId}` : "/track-order"}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Package size={16} />
          Track My Order
        </Link>
        <Link
          href="/"
          className="btn-outline flex items-center justify-center gap-2"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Loading fallback shown while Suspense resolves
function OrderSuccessLoading() {
  return (
    <div className="max-w-md w-full text-center py-16">
      <Loader2 size={36} className="animate-spin text-brand-red mx-auto mb-4" />
      <p className="text-gray-400 text-sm">Loading your order details...</p>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-white flex items-center justify-center px-4">
      <Suspense fallback={<OrderSuccessLoading />}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
