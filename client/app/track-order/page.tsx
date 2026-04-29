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

interface OrderAddress {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address?: OrderAddress;
}

interface TrackedOrder {
  _type: "regular" | "custom";
  orderId?: string;
  customOrderId?: string;
  status: string;
  deliveryMethod: string;
  paymentMethod?: string;
  paymentStatus?: string;
  upiTransactionId?: string;
  upiVerified?: boolean;
  quotedPrice?: number;
  totalAmount?: number;
  subtotal?: number;
  shippingCost?: number;
  customer: OrderCustomer;
  address?: OrderAddress;
  items?: Array<{
    name: string;
    discountedPrice: number;
    quantity: number;
    isCustom?: boolean;
    customNote?: string;
  }>;
  productName?: string;
  customDescription?: string;
}

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
      <div className="bg-green-50 border-2 border-green-400 p-4 rounded-sm">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={18} className="text-green-600 shrink-0" />
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
        {/* Amount */}
        <div className="bg-brand-red/5 border border-brand-red/20 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Amount to Pay</span>
          <span className="font-heading font-bold text-xl text-brand-red">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Step 1: QR + UPI ID */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Step 1 — Scan QR or copy UPI ID
          </p>
          {/* Stack vertically on mobile, row on sm+ */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            {/* QR — centered on mobile */}
            <div className="flex justify-center sm:justify-start sm:shrink-0">
              <div className="border-2 border-gray-100 p-2 rounded-sm bg-white inline-block">
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
            </div>

            {/* UPI ID + checklist */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <p className="text-xs text-gray-400 mb-1">UPI ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-sm text-brand-black flex-1 break-all min-w-0">
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
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={11} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Pay using PhonePe, GPay, Paytm, BHIM or any UPI app</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={11} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Pay exactly ₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={11} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Note the 12-digit UTR number after payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: UTR input */}
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
          <div className="flex items-center justify-between mt-1 gap-2">
            {utrError ? (
              <p className="text-xs text-red-500 flex-1">{utrError}</p>
            ) : (
              <p className="text-xs text-gray-400 flex-1">
                Found in your UPI app under transaction details
              </p>
            )}
            <p className={`text-xs font-mono shrink-0 ${utr.length === 12 ? "text-green-600" : "text-gray-400"}`}>
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

/** Vertical stepper shown on mobile (< sm), horizontal on sm+ */
function OrderStepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <>
      {/* ── MOBILE: vertical stepper ── */}
      <div className="sm:hidden space-y-0">
        {steps.map((step, i) => {
          const Icon = STATUS_ICONS[step] || CheckCircle;
          const done = i <= currentStep;
          const isLast = i === steps.length - 1;
          return (
            <div key={step} className="flex items-start gap-3">
              {/* Icon + connector line */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                  done
                    ? "bg-brand-red border-brand-red text-white"
                    : "bg-white border-gray-200 text-gray-300"
                }`}>
                  <Icon size={15} />
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[20px] ${done && i < currentStep ? "bg-brand-red" : "bg-gray-100"}`} />
                )}
              </div>
              {/* Label */}
              <p className={`text-sm font-medium pt-2 pb-4 leading-tight ${
                done ? "text-brand-red" : "text-gray-400"
              }`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP: horizontal stepper ── */}
      <div className="hidden sm:block overflow-x-auto pb-2">
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
                <span
                  className={`text-[9px] mt-2 font-medium text-center leading-tight ${
                    done ? "text-brand-red" : "text-gray-400"
                  }`}
                  style={{ maxWidth: 56 }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
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

  const refetchOrder = async () => {
    if (!order) return;
    const id = order.customOrderId || order.orderId || "";
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCustom = order?._type === "custom";
  const isPickup = order?.deliveryMethod === "PICKUP";

  const steps = isCustom
    ? isPickup ? CUSTOM_PICKUP_STEPS : CUSTOM_STEPS
    : isPickup ? PICKUP_STEPS : REGULAR_STEPS;

  const currentStep = order ? steps.indexOf(order.status) : -1;

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

  const displayAddress = order?.customer?.address || order?.address;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-2">
          Trikriti Studio
        </p>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-3">Track Your Order</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Enter your Order ID{" "}
          <span className="whitespace-nowrap">(TKS- for regular,</span>{" "}
          <span className="whitespace-nowrap">TKC- for custom orders)</span>
        </p>
      </div>

      {/* Search bar */}
      <div className="bg-white border border-gray-100 p-4 sm:p-6 mb-6">
        {/* Stack vertically on very small screens */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <input
            type="text"
            placeholder="e.g. TKS-A1B2C3D4"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-red font-mono"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 py-3 sm:whitespace-nowrap sm:w-auto"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {loading ? "Searching..." : "Track Order"}
          </button>
        </div>
      </div>

      {/* Not found */}
      {searched && !loading && !order && (
        <div className="bg-white border border-gray-100 p-8 sm:p-10 text-center">
          <p className="text-gray-400 font-heading text-lg mb-2">Order not found</p>
          <p className="text-gray-300 text-sm">
            Check your Order ID and try again. IDs start with TKS- or TKC-
          </p>
        </div>
      )}

      {/* Order result card */}
      {order && (
        <div className="bg-white border border-gray-100 p-4 sm:p-6 space-y-5 sm:space-y-6">

          {/* Order ID + status badges */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                {isCustom ? "Custom Order" : "Order"} ID
              </p>
              <p className="font-mono font-bold text-base sm:text-lg break-all">
                {order.orderId || order.customOrderId}
              </p>
            </div>
            {/* Badges wrap naturally */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 text-xs sm:text-sm font-semibold ${
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
                {order.status}
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
            <OrderStepper steps={steps} currentStep={currentStep} />
          )}

          {/* Custom — pricing pending notice */}
          {isCustom && !order.quotedPrice && order.status !== "Cancelled" && (
            <div className="bg-orange-50 border border-orange-200 p-4">
              <p className="font-semibold text-orange-700 text-sm mb-1">Pricing Pending</p>
              <p className="text-xs text-orange-600">
                Our team will review your request and contact you at{" "}
                <strong className="break-all">{order.customer.email}</strong>{" "}
                with pricing within 24 hours.
              </p>
            </div>
          )}

          {/* Payment pending verification */}
          {isCustom && order.quotedPrice && order.upiTransactionId && !order.upiVerified && (
            <div className="bg-yellow-50 border border-yellow-300 p-4 flex items-start gap-3">
              <Loader2 size={16} className="text-yellow-600 shrink-0 mt-0.5 animate-spin" />
              <div>
                <p className="font-semibold text-yellow-700 text-sm mb-1">
                  Payment Under Verification
                </p>
                <p className="text-xs text-yellow-600">
                  Your UTR{" "}
                  <span className="font-mono font-bold break-all">{order.upiTransactionId}</span>{" "}
                  has been received. Admin will verify and confirm your order shortly.
                </p>
              </div>
            </div>
          )}

          {/* UPI Payment Section */}
          {showUpiPayment && order.totalAmount && order.customOrderId && (
            <UpiPaymentSection
              customOrderId={order.customOrderId}
              totalAmount={order.totalAmount}
              onPaymentSubmitted={refetchOrder}
            />
          )}

          {/* Delivery details */}
          <div className="border-t pt-4 sm:pt-5">
            <h3 className="font-heading font-semibold mb-3 text-sm">Delivery Details</h3>
            <div className="text-sm text-gray-600 space-y-1.5 bg-gray-50 p-3 break-words">
              <p><span className="font-medium">Name:</span> {order.customer.name}</p>
              <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
              <p>
                <span className="font-medium">Method:</span>{" "}
                {isPickup ? "Pickup from Pune" : "Home Delivery"}
              </p>
              {!isPickup && displayAddress?.line1 && (
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {displayAddress.line1}, {displayAddress.city},{" "}
                  {displayAddress.state} – {displayAddress.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Payment + total — stack on mobile */}
          <div className="border-t pt-4 sm:pt-5 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
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
              <div className="sm:text-right">
                <p className="text-xs text-gray-400">Total Amount</p>
                <p className="font-heading font-bold text-2xl text-brand-red">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            ) : isCustom && !order.quotedPrice ? (
              <div className="sm:text-right">
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
    <div className="min-h-screen bg-brand-gray py-10 sm:py-14">
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
