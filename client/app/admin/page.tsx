"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  IndianRupee,
  Clock,
  AlertCircle,
  Palette,
} from "lucide-react";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  pendingUpiVerification: number;
  totalCustomOrders: number;
  pendingCustomOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 skeleton mb-6 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-28 skeleton rounded" />)}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/admin/orders",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/admin/orders?status=Pending",
    },
    {
      label: "Confirmed",
      value: stats.confirmedOrders,
      icon: CheckCircle,
      bg: "bg-green-50",
      iconColor: "text-green-600",
      href: "/admin/orders?status=Confirmed",
    },
    {
      label: "Shipped",
      value: stats.shippedOrders,
      icon: Truck,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/admin/orders?status=Shipped",
    },
    {
      label: "Delivered",
      value: stats.deliveredOrders,
      icon: Package,
      bg: "bg-gray-100",
      iconColor: "text-gray-600",
      href: "/admin/orders?status=Delivered",
    },
    {
      label: "Revenue (Paid)",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      bg: "bg-red-50",
      iconColor: "text-brand-red",
      href: "/admin/orders",
    },
    {
      label: "Custom Orders",
      value: stats.totalCustomOrders,
      icon: Palette,
      bg: "bg-pink-50",
      iconColor: "text-pink-600",
      href: "/admin/custom-orders",
    },
    {
      label: "Pending Custom",
      value: stats.pendingCustomOrders,
      icon: Palette,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      href: "/admin/custom-orders?status=Inquiry+Received",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-brand-black">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Trikriti Studio overview</p>
      </div>

      {/* 🔴 UPI Alert Banner */}
      {stats.pendingUpiVerification > 0 && (
        <Link href="/admin/orders?status=Pending">
          <div className="mb-6 bg-red-50 border-2 border-brand-red p-4 flex items-center gap-3 hover:bg-red-100 transition-colors cursor-pointer">
            <AlertCircle size={20} className="text-brand-red shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-brand-red text-sm">
                {stats.pendingUpiVerification} UPI payment
                {stats.pendingUpiVerification > 1 ? "s" : ""} pending verification
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Click to view orders and verify transactions
              </p>
            </div>
            <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-sm">
              {stats.pendingUpiVerification}
            </span>
          </div>
        </Link>
      )}

      {/* Custom Order Alert */}
      {stats.pendingCustomOrders > 0 && (
        <Link href="/admin/custom-orders">
          <div className="mb-6 bg-orange-50 border-2 border-orange-400 p-4 flex items-center gap-3 hover:bg-orange-100 transition-colors cursor-pointer">
            <Palette size={20} className="text-orange-500 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-orange-700 text-sm">
                {stats.pendingCustomOrders} new custom order inquir
                {stats.pendingCustomOrders > 1 ? "ies" : "y"} need pricing
              </p>
              <p className="text-xs text-orange-600 mt-0.5">
                Set the price and contact the customer
              </p>
            </div>
            <span className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-sm">
              {stats.pendingCustomOrders}
            </span>
          </div>
        </Link>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className={`${card.bg} border border-transparent hover:border-gray-200 p-5 flex items-start gap-3 transition-all cursor-pointer`}>
              <div className={`w-9 h-9 bg-white rounded-sm flex items-center justify-center shrink-0 shadow-sm`}>
                <card.icon size={18} className={card.iconColor} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-0.5">
                  {card.label}
                </p>
                <p className="font-heading font-bold text-xl text-brand-black">
                  {card.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-white border border-gray-100 p-5">
        <p className="text-sm text-gray-600">
          <strong>Admin Note:</strong> Products can only have price, discount, and stock updated — they cannot be added or deleted here. Use <code className="bg-gray-100 px-1 text-xs">npm run seed</code> to re-seed products.
        </p>
      </div>
    </div>
  );
}