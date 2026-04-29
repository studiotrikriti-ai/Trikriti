"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { orderAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  MapPin,
  Store,
  Shield,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const SHIPPING_COST = 80;
const SHIPPING_GST = Math.round(SHIPPING_COST * 0.18);
const SHIPPING_TOTAL = SHIPPING_COST + SHIPPING_GST; // ₹94
const UPI_ID = "9175825605-2@ybl";

type DeliveryMethod = "HOME_DELIVERY" | "PICKUP";

export default function CheckoutPage() {
  const { items, totalAmount: subtotal, clearCart } = useCart();
  const router = useRouter();

  // ── THE FIX ──────────────────────────────────────────────────────
  // Use a ref to track "order was just placed successfully".
  // When clearCart() runs, items becomes empty and the useEffect
  // would normally redirect to /products — the ref prevents that.
  const orderPlaced = useRef(false);
  // ─────────────────────────────────────────────────────────────────

  const [delivery, setDelivery] = useState<DeliveryMethod>("HOME_DELIVERY");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const shippingCost = delivery === "HOME_DELIVERY" ? SHIPPING_TOTAL : 0;
  const grandTotal = subtotal + shippingCost;

  // Only redirect to /products if cart is empty AND no order was placed
  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) {
      router.push("/products");
    }
  }, [items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validateUtr = (val: string) => {
    if (!val) { setUtrError("UTR number is required"); return false; }
    if (!/^\d{12}$/.test(val)) { setUtrError("Must be exactly 12 digits"); return false; }
    setUtrError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in your contact details");
      return;
    }
    if (delivery === "HOME_DELIVERY") {
      if (!form.line1 || !form.city || !form.state || !form.pincode) {
        toast.error("Please fill in your complete delivery address");
        return;
      }
      if (!validateUtr(utrNumber)) {
        toast.error("Please enter your 12-digit UPI Transaction ID");
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await orderAPI.create({
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address:
            delivery === "HOME_DELIVERY"
              ? { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode }
              : {},
        },
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          customNote: i.customNote,
        })),
        deliveryMethod: delivery,
        paymentMethod: delivery === "HOME_DELIVERY" ? "UPI" : "PICKUP_PAY",
        upiTransactionId: delivery === "HOME_DELIVERY" ? utrNumber : undefined,
      });

      // Mark order as placed BEFORE clearing cart
      // This stops the useEffect from redirecting to /products
      orderPlaced.current = true;

      clearCart();

      // Now safely redirect to success page
      router.push(`/order-success?orderId=${res.data.orderId}`);

    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || "Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  // While order is placed and we are navigating, show nothing
  if (items.length === 0 && orderPlaced.current) return null;

  // Cart is empty and no order placed — redirect handled by useEffect
  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-brand-gray py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-heading font-bold text-3xl mb-2">Checkout</h1>
        <p className="text-gray-400 text-sm mb-8">
          Manufactured in Pune · Delivered in 4–5 days
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact */}
            <div className="bg-white p-6 border border-gray-100">
              <h2 className="font-heading font-semibold text-lg mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", name: "name", placeholder: "Rahul Sharma", type: "text" },
                  { label: "Email Address", name: "email", placeholder: "rahul@example.com", type: "email" },
                  { label: "Phone Number", name: "phone", placeholder: "+91 98765 43210", type: "tel" },
                ].map((f) => (
                  <div key={f.name} className={f.name === "phone" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                      {f.label} <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white p-6 border border-gray-100">
              <h2 className="font-heading font-semibold text-lg mb-4">Delivery Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setDelivery("HOME_DELIVERY")}
                  className={`p-4 border-2 text-left transition-all ${
                    delivery === "HOME_DELIVERY"
                      ? "border-brand-red bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className={delivery === "HOME_DELIVERY" ? "text-brand-red" : "text-gray-400"} />
                    <span className="font-semibold text-sm">Home Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500">Delivered in 4–5 days</p>
                  <p className="text-xs font-semibold text-brand-red mt-1">
                    +₹{SHIPPING_COST} + GST = ₹{SHIPPING_TOTAL} shipping
                  </p>
                </button>

                <button
                  onClick={() => setDelivery("PICKUP")}
                  className={`p-4 border-2 text-left transition-all ${
                    delivery === "PICKUP"
                      ? "border-brand-red bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Store size={16} className={delivery === "PICKUP" ? "text-brand-red" : "text-gray-400"} />
                    <span className="font-semibold text-sm">Pickup — Pune</span>
                  </div>
                  <p className="text-xs text-gray-500">Pick up from our studio in Pune</p>
                  <p className="text-xs font-semibold text-green-600 mt-1">FREE · Pay at pickup</p>
                </button>
              </div>

              {delivery === "PICKUP" && (
                <div className="mt-4 bg-amber-50 border border-amber-200 p-4 flex gap-3">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Coordinate your pickup</p>
                    <p className="text-xs text-amber-700 mb-2">
                      After placing your order, contact us to arrange pickup time in Pune.
                    </p>
                    <a
                      href="mailto:studiotrikriti@gmail.com"
                      className="text-xs font-semibold text-brand-red underline"
                    >
                      studiotrikriti@gmail.com
                    </a>
                  </div>
                </div>
              )}

              {delivery === "HOME_DELIVERY" && (
                <div className="mt-5 space-y-4">
                  <div className="h-px bg-gray-100" />
                  <h3 className="font-medium text-sm text-gray-700">Delivery Address</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                      Address Line 1 <span className="text-brand-red">*</span>
                    </label>
                    <input
                      name="line1"
                      value={form.line1}
                      onChange={handleChange}
                      placeholder="House no, Street, Area"
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "City", name: "city", placeholder: "Mumbai" },
                      { label: "State", name: "state", placeholder: "Maharashtra" },
                      { label: "Pincode", name: "pincode", placeholder: "400001" },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                          {f.label} <span className="text-brand-red">*</span>
                        </label>
                        <input
                          name={f.name}
                          value={form[f.name as keyof typeof form]}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* UPI Payment */}
            {delivery === "HOME_DELIVERY" && (
              <div className="bg-white p-6 border border-gray-100">
                <h2 className="font-heading font-semibold text-lg mb-4">Payment — UPI</h2>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Step 1 — Scan QR or use UPI ID to pay ₹{grandTotal.toLocaleString("en-IN")}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-start mb-5">
                  <div className="shrink-0 border-2 border-gray-100 p-2 rounded-sm">
                    <Image
                      src="/UPI_QR_IMAGE.png"
                      alt="UPI QR Code"
                      width={160}
                      height={160}
                      className="block"
                      unoptimized
                    />
                    <p className="text-[10px] text-center text-gray-400 mt-1">Scan to pay</p>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-3">
                      <p className="text-xs text-gray-400 mb-1">UPI ID</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-base text-brand-black">{UPI_ID}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(UPI_ID);
                            toast.success("UPI ID copied!");
                          }}
                          className="text-xs text-brand-red underline"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        Pay using PhonePe, GPay, Paytm, BHIM or any UPI app
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        Pay exactly ₹{grandTotal.toLocaleString("en-IN")} (includes shipping)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        Note the 12-digit UTR number after payment
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Step 2 — Enter 12-digit UTR / Transaction Number
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={utrNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setUtrNumber(val);
                    if (utrError) validateUtr(val);
                  }}
                  onBlur={() => validateUtr(utrNumber)}
                  placeholder="e.g. 425612345678"
                  className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none transition-colors ${
                    utrError
                      ? "border-red-400 bg-red-50"
                      : utrNumber.length === 12
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
                  <p className={`text-xs font-mono ${utrNumber.length === 12 ? "text-green-600" : "text-gray-400"}`}>
                    {utrNumber.length}/12
                  </p>
                </div>
              </div>
            )}

            {delivery === "PICKUP" && (
              <div className="bg-white p-5 border border-gray-100 flex items-start gap-3">
                <Store size={18} className="text-brand-red shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Pay at Pickup</p>
                  <p className="text-xs text-gray-500">
                    No advance payment needed. Pay cash or UPI when you collect your order from our Pune studio.
                  </p>
                </div>
              </div>
            )}

            {/* FAQ */}
            <div className="bg-white border border-gray-100">
              <button
                onClick={() => setShowFaq(!showFaq)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold"
              >
                <span>Shipping & Order FAQ</span>
                {showFaq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showFaq && (
                <div className="px-6 pb-5 space-y-4 border-t border-gray-50 pt-4">
                  {[
                    { q: "When will I get my order?", a: "4–5 business days after dispatch." },
                    { q: "Where are products manufactured?", a: "All 3D printed products are manufactured in Pune, India." },
                    { q: "How much does shipping cost?", a: `₹${SHIPPING_COST} + 18% GST = ₹${SHIPPING_TOTAL}. Pickup is FREE.` },
                    { q: "Are purchases final sale?", a: "No. Exchanges accepted within 7 days of delivery." },
                    { q: "Is home delivery available?", a: "Yes, we deliver pan-India." },
                  ].map((item) => (
                    <div key={item.q}>
                      <p className="text-xs font-semibold text-brand-black mb-1">{item.q}</p>
                      <p className="text-xs text-gray-500">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>

              <ul className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-50 overflow-hidden relative rounded-sm shrink-0 border border-gray-100">
                      <Image
                        src={item.image || "https://placehold.co/56x56/f5f5f5/ccc?text=?"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-xs font-semibold text-brand-red">
                        ₹{(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  {delivery === "HOME_DELIVERY" ? (
                    <div className="text-right">
                      <span>₹{SHIPPING_TOTAL}</span>
                      <p className="text-[10px] text-gray-400">
                        ₹{SHIPPING_COST} + ₹{SHIPPING_GST} GST
                      </p>
                    </div>
                  ) : (
                    <span className="text-green-600 font-medium">FREE (Pickup)</span>
                  )}
                </div>
                <div className="flex justify-between font-heading font-bold text-lg border-t pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-brand-red">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle size={11} className="text-green-500" />
                  Manufactured in Pune
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle size={11} className="text-green-500" />
                  Delivered in 4–5 business days
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle size={11} className="text-green-500" />
                  Exchanges accepted within 7 days
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full btn-primary mt-5 py-3.5 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Placing Order..."
                  : delivery === "PICKUP"
                  ? "Place Order (Pay at Pickup)"
                  : "Place Order"}
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-xs">
                <Shield size={11} />
                Safe & Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
