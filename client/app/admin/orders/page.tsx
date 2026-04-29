"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";

const ALL_STATUSES = [
  "Pending", "Confirmed", "Shipped", "Delivered",
  "Ready for Pickup", "Picked Up",  
] as const;
type OrderStatus = typeof ALL_STATUSES[number];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  "Ready for Pickup": "bg-orange-100 text-orange-700",
  "Picked Up": "bg-gray-100 text-gray-600",
};

type Order = Record<string, unknown>;

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get("status") || "all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null); // detail modal

  const fetchOrders = (status?: string) => {
    setLoading(true);
    const params = status && status !== "all" ? { status } : {};
    adminAPI
      .getOrders(params)
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const s = searchParams.get("status") || "all";
    setFilter(s);
    fetchOrders(s === "all" ? undefined : s);
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await adminAPI.updateOrder(orderId, { status });
      const updated = res.data.order;
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      if (selected && (selected.orderId as string) === orderId) setSelected(updated);
      toast.success(`Status → ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleVerifyUpi = async (orderId: string) => {
    setUpdating(orderId);
    try {
      const res = await adminAPI.verifyUpi(orderId);
      const updated = res.data.order;
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      if (selected && (selected.orderId as string) === orderId) setSelected(updated);
      toast.success("✅ UPI verified — order confirmed!");
    } catch {
      toast.error("Failed to verify UPI");
    } finally {
      setUpdating(null);
    }
  };

  const pendingUpiOrders = orders.filter(
    (o) => o.paymentMethod === "UPI" && !o.upiVerified
  );

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-heading font-bold text-2xl">Orders</h1>
          <p className="text-gray-400 text-sm">{orders.length} orders</p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {["all", ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilter(s);
                fetchOrders(s === "all" ? undefined : s);
              }}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filter === s
                  ? "bg-brand-red text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-red"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* UPI Alert */}
      {pendingUpiOrders.length > 0 && (
        <div className="mb-4 bg-red-50 border border-brand-red p-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-brand-red shrink-0" />
          <p className="text-sm text-red-700">
            <strong>{pendingUpiOrders.length}</strong> order
            {pendingUpiOrders.length > 1 ? "s" : ""} have unverified UPI payments. Verify below.
          </p>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <p className="text-gray-400 font-heading text-lg">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order ID", "Customer", "Delivery", "Amount", "UPI / Payment", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const customer = order.customer as Record<string, unknown>;
                  const isUpiUnverified =
                    order.paymentMethod === "UPI" && !order.upiVerified;

                  return (
                    <tr
                      key={order.orderId as string}
                      className={`hover:bg-gray-50 transition-colors ${
                        isUpiUnverified ? "bg-red-50/30" : ""
                      }`}
                    >
                      {/* Order ID */}
                      <td className="px-4 py-3 font-mono text-xs font-bold text-brand-black">
                        {order.orderId as string}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs">{customer?.name as string}</div>
                        <div className="text-xs text-gray-400">{customer?.phone as string}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[120px]">
                          {customer?.email as string}
                        </div>
                      </td>

                      {/* Delivery */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 ${
                          order.deliveryMethod === "PICKUP"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {order.deliveryMethod === "PICKUP" ? "Pickup" : "Home"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3">
                        <div className="font-heading font-bold text-brand-red text-sm">
                          ₹{(order.totalAmount as number).toLocaleString("en-IN")}
                        </div>
                        {(order.shippingCost as number) > 0 && (
                          <div className="text-xs text-gray-400">
                            incl. ₹{order.shippingCost as number} shipping
                          </div>
                        )}
                      </td>

                      {/* UPI / Payment */}
                      <td className="px-4 py-3">
                        {order.paymentMethod === "UPI" ? (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              {order.upiVerified ? (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                  <CheckCircle size={11} /> Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                                  <AlertCircle size={11} /> Unverified
                                </span>
                              )}
                            </div>
                            {order.upiTransactionId ? (
                              <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded select-all">
                                {order.upiTransactionId as string}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 italic">No UTR yet</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1">
                            Pay at Pickup
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 whitespace-nowrap ${
                          STATUS_COLORS[order.status as string] || "bg-gray-100 text-gray-600"
                        }`}>
                          {order.status as string}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {/* Verify UPI button */}
                          {isUpiUnverified && order.upiTransactionId && (
                            <button
                              onClick={() => handleVerifyUpi(order.orderId as string)}
                              disabled={updating === order.orderId}
                              className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1.5 hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              <CheckCircle size={11} />
                              Verify UPI
                            </button>
                          )}

                          {/* Status dropdown */}
                          <select
                            value={order.status as string}
                            disabled={updating === order.orderId}
                            onChange={(e) =>
                              handleStatusChange(order.orderId as string, e.target.value)
                            }
                            className="text-xs border border-gray-200 px-2 py-1.5 focus:outline-none focus:border-brand-red bg-white disabled:opacity-50 cursor-pointer"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          {/* View details */}
                          <button
                            onClick={() => setSelected(order)}
                            className="flex items-center gap-1 text-xs text-brand-red hover:underline"
                          >
                            <Eye size={11} /> Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Order</p>
                <p className="font-mono font-bold text-lg text-brand-black">
                  {selected.orderId as string}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-gray-100 rounded-sm transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status + Payment */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1.5 ${
                  STATUS_COLORS[selected.status as string] || "bg-gray-100 text-gray-600"
                }`}>
                  {selected.status as string}
                </span>
                <span className={`text-xs font-medium px-3 py-1.5 ${
                  selected.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  Payment: {selected.paymentStatus as string}
                </span>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Customer
                </p>
                <div className="bg-gray-50 p-3 space-y-1 text-sm">
                  {(() => {
                    const c = selected.customer as Record<string, unknown>;
                    const a = c?.address as Record<string, unknown>;
                    return (
                      <>
                        <p><span className="font-medium">Name:</span> {c?.name as string}</p>
                        <p><span className="font-medium">Email:</span> {c?.email as string}</p>
                        <p><span className="font-medium">Phone:</span> {c?.phone as string}</p>
                        {selected.deliveryMethod === "HOME_DELIVERY" && a?.line1 && (
                          <p>
                            <span className="font-medium">Address:</span>{" "}
                            {a.line1 as string}, {a.city as string}, {a.state as string} –{" "}
                            {a.pincode as string}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* UPI Details */}
              {selected.paymentMethod === "UPI" && (
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
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                      <span className={`text-sm font-semibold ${
                        selected.upiVerified ? "text-green-700" : "text-red-600"
                      }`}>
                        {selected.upiVerified ? "UPI Verified & Paid" : "UPI Not Yet Verified"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-1">12-digit UTR / Transaction ID:</p>
                    {selected.upiTransactionId ? (
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-lg tracking-widest text-brand-black bg-white px-3 py-2 border border-gray-200 flex-1 text-center select-all">
                          {selected.upiTransactionId as string}
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selected.upiTransactionId as string);
                            toast.success("UTR copied!");
                          }}
                          className="text-xs text-brand-red underline whitespace-nowrap"
                        >
                          Copy
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Customer hasn't submitted UTR yet</p>
                    )}

                    {!selected.upiVerified && selected.upiTransactionId && (
                      <button
                        onClick={() => handleVerifyUpi(selected.orderId as string)}
                        disabled={updating === selected.orderId}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={15} />
                        {updating === selected.orderId
                          ? "Verifying..."
                          : "✅ Verify UPI & Confirm Order"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Items
                </p>
                <ul className="space-y-2">
                  {(selected.items as Record<string, unknown>[]).map((item, i) => (
                    <li key={i} className="flex justify-between items-start text-sm bg-gray-50 p-3">
                      <div>
                        <p className="font-medium">{item.name as string}</p>
                        {item.isCustom && (
                          <span className="text-[10px] bg-brand-red text-white px-1.5 py-0.5">
                            Custom
                          </span>
                        )}
                        {item.customNote && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            Note: {item.customNote as string}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">Qty: {item.quantity as number}</p>
                      </div>
                      <span className="font-semibold text-brand-red whitespace-nowrap">
                        ₹{((item.discountedPrice as number) * (item.quantity as number)).toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{(selected.subtotal as number)?.toLocaleString("en-IN") || "—"}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>
                    {(selected.shippingCost as number) > 0
                      ? `₹${(selected.shippingCost as number).toLocaleString("en-IN")}`
                      : "FREE (Pickup)"}
                  </span>
                </div>
                <div className="flex justify-between font-heading font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-brand-red">
                    ₹{(selected.totalAmount as number).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Update Status
                </p>
                <select
                  value={selected.status as string}
                  disabled={updating === selected.orderId}
                  onChange={(e) => handleStatusChange(selected.orderId as string, e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red bg-white disabled:opacity-50"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}