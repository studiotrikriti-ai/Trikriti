"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  CheckCircle,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";

const ALL_STATUSES = [
  "Pending", "Confirmed", "Shipped", "Delivered",
  "Ready for Pickup", "Picked Up",
] as const;

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  "Ready for Pickup": "bg-orange-100 text-orange-700",
  "Picked Up": "bg-gray-100 text-gray-600",
};

interface OrderItem {
  name: string;
  image?: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  isCustom?: boolean;
  customNote?: string;
}

interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

interface Order {
  orderId: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  upiTransactionId?: string;
  upiVerified: boolean;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get("status") || "all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  const fetchOrders = (status?: string) => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (status && status !== "all") params.status = status;
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
      const updated: Order = res.data.order;
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      if (selected?.orderId === orderId) setSelected(updated);
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
      const updated: Order = res.data.order;
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      if (selected?.orderId === orderId) setSelected(updated);
      toast.success(" UPI verified — order confirmed!");
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
                  const isUpiUnverified = order.paymentMethod === "UPI" && !order.upiVerified;
                  return (
                    <tr
                      key={order.orderId}
                      className={`hover:bg-gray-50 transition-colors ${isUpiUnverified ? "bg-red-50/30" : ""}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-brand-black">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs">{order.customer.name}</div>
                        <div className="text-xs text-gray-400">{order.customer.phone}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[120px]">{order.customer.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 ${
                          order.deliveryMethod === "PICKUP"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {order.deliveryMethod === "PICKUP" ? "Pickup" : "Home"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-heading font-bold text-brand-red text-sm">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </div>
                        {order.shippingCost > 0 && (
                          <div className="text-xs text-gray-400">
                            incl. ₹{order.shippingCost} shipping
                          </div>
                        )}
                      </td>
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
                                {order.upiTransactionId}
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
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 whitespace-nowrap ${
                          STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {isUpiUnverified && order.upiTransactionId && (
                            <button
                              onClick={() => handleVerifyUpi(order.orderId)}
                              disabled={updating === order.orderId}
                              className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1.5 hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              <CheckCircle size={11} />
                              Verify UPI
                            </button>
                          )}
                          <select
                            value={order.status}
                            disabled={updating === order.orderId}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                            className="text-xs border border-gray-200 px-2 py-1.5 focus:outline-none focus:border-brand-red bg-white disabled:opacity-50 cursor-pointer"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
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
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Order</p>
                <p className="font-mono font-bold text-lg text-brand-black">{selected.orderId}</p>
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
                  STATUS_COLORS[selected.status] || "bg-gray-100 text-gray-600"
                }`}>
                  {selected.status}
                </span>
                <span className={`text-xs font-medium px-3 py-1.5 ${
                  selected.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  Payment: {selected.paymentStatus}
                </span>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                <div className="bg-gray-50 p-3 space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {selected.customer.name}</p>
                  <p><span className="font-medium">Email:</span> {selected.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {selected.customer.phone}</p>
                  {selected.deliveryMethod === "HOME_DELIVERY" && selected.customer.address?.line1 && (
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selected.customer.address.line1}, {selected.customer.address.city},{" "}
                      {selected.customer.address.state} – {selected.customer.address.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* UPI Details */}
              {selected.paymentMethod === "UPI" && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">UPI Payment</p>
                  <div className={`p-4 border-2 ${
                    selected.upiVerified ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
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
                          {selected.upiTransactionId}
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selected.upiTransactionId!);
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
                        onClick={() => handleVerifyUpi(selected.orderId)}
                        disabled={updating === selected.orderId}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={15} />
                        {updating === selected.orderId ? "Verifying..." : "✅ Verify UPI & Confirm Order"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Items</p>
                <ul className="space-y-2">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex justify-between items-start text-sm bg-gray-50 p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.isCustom && (
                          <span className="text-[10px] bg-brand-red text-white px-1.5 py-0.5">Custom</span>
                        )}
                        {item.customNote && (
                          <p className="text-xs text-gray-500 mt-1 italic">Note: {item.customNote}</p>
                        )}
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-brand-red whitespace-nowrap">
                        ₹{(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{selected.subtotal?.toLocaleString("en-IN") || "—"}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>
                    {selected.shippingCost > 0
                      ? `₹${selected.shippingCost.toLocaleString("en-IN")}`
                      : "FREE (Pickup)"}
                  </span>
                </div>
                <div className="flex justify-between font-heading font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-brand-red">₹{selected.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Update Status</p>
                <select
                  value={selected.status}
                  disabled={updating === selected.orderId}
                  onChange={(e) => handleStatusChange(selected.orderId, e.target.value)}
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
