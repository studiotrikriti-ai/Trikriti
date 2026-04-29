"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { CheckCircle, AlertCircle, X, Save, IndianRupee } from "lucide-react";

const CUSTOM_STATUSES = [
  "Inquiry Received",
  "Pricing Sent",
  "Confirmed",
  "In Production",
  "Ready for Pickup",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

const STATUS_COLORS: Record<string, string> = {
  "Inquiry Received": "bg-yellow-100 text-yellow-700",
  "Pricing Sent": "bg-blue-100 text-blue-700",
  Confirmed: "bg-green-100 text-green-700",
  "In Production": "bg-purple-100 text-purple-700",
  "Ready for Pickup": "bg-orange-100 text-orange-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-700",
};

type CustomOrder = Record<string, unknown>;

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<CustomOrder | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit fields for selected order
  const [quotedPrice, setQuotedPrice] = useState("");
  const [shippingCost, setShippingCost] = useState("94");
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchOrders = (status?: string) => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (status && status !== "all") params.status = status;
    adminAPI
      .getCustomOrders(params)
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const openOrder = (order: CustomOrder) => {
    setSelected(order);
    setQuotedPrice(order.quotedPrice ? String(order.quotedPrice) : "");
    setShippingCost(order.shippingCost !== null && order.shippingCost !== undefined
      ? String(order.shippingCost) : "94");
    setNewStatus(order.status as string);
    setAdminNotes(order.adminNotes as string || "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        status: newStatus,
        adminNotes,
      };
      if (quotedPrice) payload.quotedPrice = Number(quotedPrice);
      if (shippingCost !== "") payload.shippingCost = Number(shippingCost);

      const res = await adminAPI.updateCustomOrder(
        selected.customOrderId as string,
        payload
      );
      const updated = res.data.order;
      setOrders((prev) =>
        prev.map((o) =>
          o.customOrderId === updated.customOrderId ? updated : o
        )
      );
      setSelected(updated);
      toast.success("Custom order updated!");
    } catch {
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyUpi = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await adminAPI.updateCustomOrder(
        selected.customOrderId as string,
        { upiVerified: true, status: "Confirmed" }
      );
      const updated = res.data.order;
      setOrders((prev) =>
        prev.map((o) =>
          o.customOrderId === updated.customOrderId ? updated : o
        )
      );
      setSelected(updated);
      setNewStatus("Confirmed");
      toast.success("✅ UPI verified — order confirmed!");
    } catch {
      toast.error("Failed to verify UPI");
    } finally {
      setSaving(false);
    }
  };

  const totalAmount =
    (Number(quotedPrice) || 0) + (Number(shippingCost) || 0);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-heading font-bold text-2xl">Custom Orders</h1>
          <p className="text-gray-400 text-sm">
            {orders.length} inquiries · You set the price
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...CUSTOM_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); fetchOrders(s === "all" ? undefined : s); }}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filter === s
                  ? "bg-brand-red text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-red"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 skeleton rounded" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <p className="text-gray-400 font-heading text-lg">No custom orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const c = order.customer as Record<string, unknown>;
            const upiUnverified = Boolean(order.upiTransactionId) && !Boolean(order.upiVerified);

            return (
              <div
                key={order.customOrderId as string}
                onClick={() => openOrder(order)}
                className={`bg-white border cursor-pointer hover:border-brand-red hover:shadow-sm transition-all p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                  upiUnverified ? "border-red-300 bg-red-50/20" : "border-gray-100"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs font-bold text-brand-black">
                      {order.customOrderId as string}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 ${
                      STATUS_COLORS[order.status as string] || "bg-gray-100 text-gray-600"
                    }`}>
                      {order.status as string}
                    </span>
                    {upiUnverified && (
                      <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 flex items-center gap-1">
                        <AlertCircle size={10} /> UPI Pending
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-sm">{c?.name as string}</p>
                  <p className="text-xs text-gray-400">{c?.email as string} · {c?.phone as string}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    <span className="font-medium">Product:</span> {order.productName as string}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    <span className="font-medium">Request:</span> {order.customDescription as string}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {order.quotedPrice ? (
                    <div className="font-heading font-bold text-lg text-brand-red">
                      ₹{(order.totalAmount as number)?.toLocaleString("en-IN")}
                    </div>
                  ) : (
                    <div className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1">
                      Price not set
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {order.deliveryMethod === "PICKUP" ? "Pickup" : "Home Delivery"}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(order.createdAt as string).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Custom Order</p>
                <p className="font-mono font-bold text-base">
                  {selected.customOrderId as string}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-sm">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-5 space-y-5 overflow-y-auto">
              {/* Customer */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                <div className="bg-gray-50 p-3 text-sm space-y-1">
                  {(() => {
                    const c = selected.customer as Record<string, unknown>;
                    const a = selected.address as Record<string, unknown>;
                    return (
                      <>
                        <p><span className="font-medium">Name:</span> {c?.name as string}</p>
                        <p><span className="font-medium">Email:</span>{" "}
                          <a href={`mailto:${c?.email}`} className="text-brand-red underline">
                            {c?.email as string}
                          </a>
                        </p>
                        <p><span className="font-medium">Phone:</span> {c?.phone as string}</p>
                        <p><span className="font-medium">Delivery:</span> {selected.deliveryMethod as string}</p>
                        {selected.deliveryMethod === "HOME_DELIVERY" && a?.line1 && (
                          <p><span className="font-medium">Address:</span>{" "}
                            {a.line1 as string}, {a.city as string}, {a.state as string} – {a.pincode as string}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Product & Request */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Custom Request
                </p>
                <div className="bg-gray-50 p-3 text-sm space-y-2">
                  <p><span className="font-medium">Product:</span> {selected.productName as string}</p>
                  <p><span className="font-medium">Description:</span></p>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {selected.customDescription as string}
                  </p>
                  {selected.referenceImageUrl && (
                    <div>
                      <p className="font-medium mb-1">Reference Image:</p>
                      <a
                        href={selected.referenceImageUrl as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-red text-xs underline"
                      >
                        View Image →
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* UPI verification */}
              {selected.upiTransactionId && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    UPI Payment
                  </p>
                  <div className={`p-4 border-2 ${
                    selected.upiVerified
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selected.upiVerified ? (
                        <CheckCircle size={15} className="text-green-600" />
                      ) : (
                        <AlertCircle size={15} className="text-red-500" />
                      )}
                      <span className={`text-sm font-semibold ${
                        selected.upiVerified ? "text-green-700" : "text-red-600"
                      }`}>
                        {selected.upiVerified ? "Verified & Paid" : "Awaiting Verification"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">UTR Number:</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg bg-white px-3 py-2 border border-gray-200 flex-1 text-center select-all">
                        {selected.upiTransactionId as string}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selected.upiTransactionId as string);
                          toast.success("Copied!");
                        }}
                        className="text-xs text-brand-red underline"
                      >
                        Copy
                      </button>
                    </div>
                    {!selected.upiVerified && (
                      <button
                        onClick={handleVerifyUpi}
                        disabled={saving}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle size={15} />
                        Verify UPI & Confirm Order
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── SET PRICE (Admin Only) ── */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Set Price (Admin)
                </p>
                <div className="space-y-3 bg-orange-50 border border-orange-200 p-4">
                  <p className="text-xs text-orange-700">
                    Set the product price and shipping cost, then change status to "Pricing Sent" and contact the customer.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Product Price (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          min={0}
                          value={quotedPrice}
                          onChange={(e) => setQuotedPrice(e.target.value)}
                          placeholder="e.g. 1500"
                          className="w-full border border-gray-200 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Shipping (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          min={0}
                          value={shippingCost}
                          onChange={(e) => setShippingCost(e.target.value)}
                          className="w-full border border-gray-200 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">94 for delivery, 0 for pickup</p>
                    </div>
                  </div>
                  {quotedPrice && (
                    <div className="flex justify-between items-center bg-white border border-orange-200 px-3 py-2">
                      <span className="text-sm text-gray-500">Total to charge customer</span>
                      <span className="font-heading font-bold text-lg text-brand-red">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red bg-white"
                >
                  {CUSTOM_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes (not shown to customer)"
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none"
                />
              </div>
            </div>

            {/* Save */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-3 font-semibold text-sm hover:bg-brand-red-dark transition-colors disabled:opacity-50"
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
