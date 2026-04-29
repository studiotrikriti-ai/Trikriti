"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { orderAPI, customOrderAPI } from "@/lib/api";
import { Search, Package, Truck, CheckCircle, Clock, Loader2, Store, Smartphone, Copy } from "lucide-react";
import toast from "react-hot-toast";

const REGULAR_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];
const PICKUP_STEPS = ["Pending", "Confirmed", "Ready for Pickup", "Picked Up"];
const CUSTOM_STEPS = ["Inquiry Received", "Pricing Sent", "Confirmed", "In Production", "Shipped", "Delivered"];
const CUSTOM_PICKUP_STEPS = ["Inquiry Received", "Pricing Sent", "Confirmed", "In Production", "Ready for Pickup", "Picked Up"];

const STATUS_ICONS: Record<string, React.ElementType> = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Shipped: Truck,
  Delivered: Package,
  "Ready for Pickup": Store,
  "Picked Up": CheckCircle,
  "Inquiry Received": Clock,
  "Pricing Sent": Smartphone,
  "In Production": Package,
};

const UPI_ID = "9175825605-2@ybl";

function UpiPaymentSection({
  customOrderId,
  totalAmount,
  onPaymentSubmitted,
}: {
  customOrderId: string;
  totalAmount: number;
  onPaymentSubmitted: () => void;
}) {
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateUtr = (val: string) => {
    if (!val) { setUtrError("UTR number is required"); return false; }
    if (!/^\d{12}$/.test(val)) { setUtrError("Must be exactly 12 digits"); return false; }
    setUtrError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateUtr(utr)) return;
    setSubmitting(true);
    try {
      await customOrderAPI.submitUpi({ customOrderId, upiTransactionId: utr });
      setSubmitted(true);
      toast.success("Payment submitted! Admin will verify and confirm your order.");
      onPaymentSubmitted();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || "Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-400 p-5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={18} className="text-green-600" />
          <p className="font-semibold text-green-700">Payment Submitted!</p>
        </div>
        <p className="text-xs text-green-600">
          Your UTR number has been received. Admin will verify your payment and confirm your order within a few hours.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t pt-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Pay Now — UPI
      </p>

      <div className="space-y-4">
        {/* Amount to pay */}
        <div className="bg-brand-red/5 border border-brand-red/20 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Amount to Pay</span>
          <span className="font-heading font-bold text-xl text-brand-red">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Step 1 — QR + UPI ID */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Step 1 — Scan QR or copy UPI ID
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* QR Code */}
            <div className="shrink-0 border-2 border-gray-100 p-2 rounded-sm bg-white">
              {/* Replace /UPI_QR_IMAGE.png with your actual QR image in /public */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/UPI_QR_IMAGE.png"
                alt="UPI QR Code"
                width={140}
                height={140}
                className="block"
              />
              <p className="text-[10px] text-center text-gray-400 mt-1">Scan to pay</p>
            </div>

            {/* UPI ID */}
            <div className="flex-1 space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <p className="text-xs text-gray-400 mb-1">UPI ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-base text-brand-black flex-1 break-all">
                    {UPI_ID}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(UPI_ID);
                      toast.success("UPI ID copied!");
                    }}
                    className="flex items-center gap-1 text-xs text-brand-red underline shrink-0"
                  >
                    <Copy size={11} />
                    Copy
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-green-500 shrink-0" />
                  Pay using PhonePe, GPay, Paytm, BHIM or any UPI app
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-green-500 shrink-0" />
                  Pay exactly ₹{totalAmount.toLocaleString("en-IN")}
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-green-500 shrink-0" />
                  Note the 12-digit UTR number after payment
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 — Enter UTR */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Step 2 — Enter 12-digit UTR / Transaction Number
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={12}
            value={utr}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 12);
              setUtr(val);
              if (utrError) validateUtr(val);
            }}
            onBlur={() => utr && validateUtr(utr)}
            placeholder="e.g. 425612345678"
            className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none transition-colors ${
              utrError
                ? "border-red-400 bg-red-50"
                : utr.length === 12
                ? "border-green-400 bg-green-50"
                : "border-gray-200 focus:border-brand-red"
            }`}
          />
          <div className="flex items-center justify-between mt-1">
            {utrError ? (
              <p className="text-xs text-red-500">{utrError}</p>
            ) : (
              <p className="text-xs text-gray-400">
                Found in your UPI app under transaction details
              </p>
            )}
            <p className={`text-xs font-mono ${utr.length === 12 ? "text-green-600" : "text-gray-400"}`}>
              {utr.length}/12
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || utr.length !== 12}
          className="w-full bg-brand-red text-white py-3 text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <><Loader2 size={15} className="animate-spin" /> Submitting...</>
          ) : (
            <><CheckCircle size={15} /> Submit Payment</>
          )}
        </button>
      </div>
    </div>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (id?: string) => {
    const searchId = (id ?? orderId).trim();
    if (!searchId) { toast.error("Please enter an Order ID"); return; }
    setLoading(true);
    setSearched(true);
    try {
      if (searchId.startsWith("TKS-")) {
        const res = await orderAPI.track(searchId);
        setOrder({ ...res.data.order, _type: "regular" });
      } else if (searchId.startsWith("TKC-")) {
        const res = await customOrderAPI.track(searchId);
        setOrder({ ...res.data.order, _type: "custom" });
      } else {
        try {
          const res = await orderAPI.track(searchId);
          setOrder({ ...res.data.order, _type: "regular" });
        } catch {
          const res = await customOrderAPI.track(searchId);
          setOrder({ ...res.data.order, _type: "custom" });
        }
      }
    } catch {
      toast.error("Order not found. Please check your Order ID.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch order after UPI submitted so status updates live
  const refetchOrder = async () => {
    if (!order) return;
    const id = (order.customOrderId || order.orderId) as string;
    try {
      if (id.startsWith("TKC-")) {
        const res = await customOrderAPI.track(id);
        setOrder({ ...res.data.order, _type: "custom" });
      } else {
        const res = await orderAPI.track(id);
        setOrder({ ...res.data.order, _type: "regular" });
      }
    } catch { /* silent */ }
  };

  useEffect(() => {
    const urlOrderId = searchParams.get("orderId");
    if (urlOrderId) {
      setOrderId(urlOrderId);
      handleSearch(urlOrderId);
    }
  }, []);

  const isCustom = order?._type === "custom";
  const isPickup = order?.deliveryMethod === "PICKUP";

  const steps = isCustom
    ? isPickup ? CUSTOM_PICKUP_STEPS : CUSTOM_STEPS
    : isPickup ? PICKUP_STEPS : REGULAR_STEPS;

  const currentStep = order ? steps.indexOf(order.status as string) : -1;

  // Show UPI payment section for custom orders when:
  // 1. Admin has set a price (quotedPrice exists)
  // 2. Delivery is HOME_DELIVERY (not pickup)
  // 3. Customer hasn't submitted UTR yet (no upiTransactionId)
  // 4. Order is not yet confirmed/paid
  const showUpiPayment =
    isCustom &&
    !isPickup &&
    order?.quotedPrice &&
    !order?.upiTransactionId &&
    order?.status !== "Confirmed" &&
    order?.status !== "In Production" &&
    order?.status !== "Shipped" &&
    order?.status !== "Delivered" &&
    order?.status !== "Cancelled";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-2">
          Trikriti Studio
        </p>
        <h1 className="font-heading font-bold text-4xl mb-3">Track Your Order</h1>
        <p className="text-gray-500 text-sm">
          Enter your Order ID (TKS- for regular orders, TKC- for custom orders)
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-100 p-6 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. TKS-A1B2C3D4 or TKC-A1B2C3D4"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red font-mono"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Search size={15} />
            )}
            {loading ? "Searching..." : "Track"}
          </button>
        </div>
      </div>

      {/* No result */}
      {searched && !loading && !order && (
        <div className="bg-white border border-gray-100 p-10 text-center">
          <p className="text-gray-400 font-heading text-lg mb-2">Order not found</p>
          <p className="text-gray-300 text-sm">
            Check your Order ID and try again. IDs start with TKS- or TKC-
          </p>
        </div>
      )}

      {/* Result */}
      {order && (
        <div className="bg-white border border-gray-100 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                {isCustom ? "Custom Order" : "Order"} ID
              </p>
              <p className="font-mono font-bold text-lg">
                {(order.orderId || order.customOrderId) as string}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 text-sm font-semibold ${
                order.status === "Delivered" || order.status === "Picked Up"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Shipped" || order.status === "Ready for Pickup"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "Confirmed" || order.status === "In Production"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {order.status as string}
              </span>
              {isPickup && (
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 font-medium">
                  Pickup
                </span>
              )}
              {isCustom && (
                <span className="px-2 py-1 text-xs bg-pink-100 text-pink-600 font-medium">
                  Custom Order
                </span>
              )}
            </div>
          </div>

          {/* Progress stepper */}
          {order.status !== "Cancelled" && (
            <div className="overflow-x-auto pb-2">
              <div
                className="flex items-start justify-between relative"
                style={{ minWidth: steps.length * 72 }}
              >
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-brand-red z-0 transition-all duration-500"
                  style={{
                    width: currentStep <= 0
                      ? "0%"
                      : `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                />
                {steps.map((step, i) => {
                  const Icon = STATUS_ICONS[step] || CheckCircle;
                  const done = i <= currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center z-10 px-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        done
                          ? "bg-brand-red border-brand-red text-white"
                          : "bg-white border-gray-200 text-gray-300"
                      }`}>
                        <Icon size={16} />
                      </div>
                      <span className={`text-[9px] mt-2 font-medium text-center leading-tight ${
                        done ? "text-brand-red" : "text-gray-400"
                      }`} style={{ maxWidth: 56 }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom order pricing pending notice */}
          {isCustom && !order.quotedPrice && order.status !== "Cancelled" && (
            <div className="bg-orange-50 border border-orange-200 p-4">
              <p className="font-semibold text-orange-700 text-sm mb-1">Pricing Pending</p>
              <p className="text-xs text-orange-600">
                Our team will review your request and contact you at{" "}
                <strong>{(order.customer as Record<string, unknown>)?.email as string}</strong>{" "}
                with pricing within 24 hours.
              </p>
            </div>
          )}

          {/* Custom order price set — waiting for payment (HOME DELIVERY only) */}
          {isCustom && order.quotedPrice && order.upiTransactionId && !order.upiVerified && (
            <div className="bg-yellow-50 border border-yellow-300 p-4 flex items-start gap-3">
              <Loader2 size={16} className="text-yellow-600 shrink-0 mt-0.5 animate-spin" />
              <div>
                <p className="font-semibold text-yellow-700 text-sm mb-1">
                  Payment Under Verification
                </p>
                <p className="text-xs text-yellow-600">
                  Your UTR <span className="font-mono font-bold">{order.upiTransactionId as string}</span> has been received. Admin will verify and confirm your order shortly.
                </p>
              </div>
            </div>
          )}

          {/* ── UPI Payment Section for Custom Orders ── */}
          {showUpiPayment && (
            <UpiPaymentSection
              customOrderId={order.customOrderId as string}
              totalAmount={order.totalAmount as number}
              onPaymentSubmitted={refetchOrder}
            />
          )}

          {/* Customer info */}
          <div className="border-t pt-5">
            <h3 className="font-heading font-semibold mb-3 text-sm">Delivery Details</h3>
            <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3">
              {(() => {
                const customer = order.customer as Record<string, unknown>;
                const address = (customer?.address || order.address) as Record<string, unknown>;
                return (
                  <>
                    <p><span className="font-medium">Name:</span> {customer?.name as string}</p>
                    <p><span className="font-medium">Phone:</span> {customer?.phone as string}</p>
                    <p><span className="font-medium">Method:</span>{" "}
                      {isPickup ? "Pickup from Pune" : "Home Delivery"}
                    </p>
                    {!isPickup && address?.line1 && (
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {address.line1 as string}, {address.city as string},{" "}
                        {address.state as string} – {address.pincode as string}
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Payment status */}
          <div className="border-t pt-5 flex justify-between items-center flex-wrap gap-3">
            <div>
              <p className="text-xs text-gray-400">Payment</p>
              <p className="font-medium text-sm">
                {order.paymentMethod === "PICKUP_PAY" || isPickup
                  ? "Pay at Pickup"
                  : order.upiVerified
                  ? "UPI ✅ Verified & Paid"
                  : order.upiTransactionId
                  ? "UPI ⏳ Pending Verification"
                  : isCustom && order.quotedPrice
                  ? "UPI — Payment Required"
                  : "UPI"}
              </p>
            </div>
            {order.totalAmount ? (
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Amount</p>
                <p className="font-heading font-bold text-xl text-brand-red">
                  ₹{(order.totalAmount as number).toLocaleString("en-IN")}
                </p>
              </div>
            ) : isCustom && !order.quotedPrice ? (
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Amount</p>
                <p className="text-sm text-orange-500 font-medium">Pricing pending</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-brand-gray py-14">
      <Suspense fallback={
        <div className="max-w-2xl mx-auto px-4 sm:px-6 flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-red" />
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}