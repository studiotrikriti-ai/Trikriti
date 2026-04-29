"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  Palette,
  Menu,
  X,
} from "lucide-react";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Custom Orders", href: "/admin/custom-orders", icon: Palette },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [loading, isAdmin, pathname]);

  useEffect(() => setSidebarOpen(false), [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-white text-sm animate-pulse">Loading admin...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="font-heading font-bold text-base tracking-wide">TRIKRITI</div>
          <div className="text-brand-red text-[10px] tracking-widest uppercase">Admin Panel</div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {adminLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                active
                  ? "bg-brand-red text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-[11px] text-gray-600 mb-2 truncate">{user?.email}</p>
        <button
          onClick={() => { logout(); router.push("/admin/login"); }}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-red transition-colors"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-56 bg-brand-black text-white flex-col shrink-0 fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-brand-black text-white flex flex-col h-full z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-sm transition-colors"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs text-gray-400">Trikriti Studio</p>
            <p className="text-sm font-semibold text-brand-black capitalize">
              {adminLinks.find((l) => l.href === pathname)?.label || "Admin"}
            </p>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        {/* ── Mobile Bottom Nav ── */}
        <nav className="lg:hidden bg-brand-black border-t border-white/10 flex fixed bottom-0 left-0 right-0 z-30">
          {adminLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-[10px] transition-colors ${
                  active ? "text-brand-red" : "text-gray-500"
                }`}
              >
                <link.icon size={18} />
                <span className="leading-none">{link.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
        {/* Bottom nav spacer on mobile */}
        <div className="h-14 lg:hidden" />
      </div>
    </div>
  );
}