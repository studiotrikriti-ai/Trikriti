"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/ui/CartDrawer";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Custom", href: "/custom" },
  { label: "Blog", href: "/blog" },
  { label: "Track Order", href: "/track-order" },
  { label: "Contact", href: "/contact" },
];

const marqueeItems = [
  "🖨️ Premium 3D Printed Products",
  "✦",
  "Mini Tumbler Keychains",
  "✦",
  "Aurora Prism Lamp — ₹1200",
  "✦",
  "Luna Swirl Lamp — ₹1300",
  "✦",
  "40% OFF Live Now",
  "✦",
  "Pan-India Delivery — ₹80",
  "✦",
  "Custom 3D Prints Available",
  "✦",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        {/* Marquee strip */}
        <div className="bg-brand-black text-white text-xs py-1.5 overflow-hidden">
          <div className="marquee-track whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((text, i) => (
              <span key={i} className="px-5">{text}</span>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/trikriti.%20(4).png"
                alt="Trikriti Studio"
                width={140}
                height={48}
                priority
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-150 relative ${
                    pathname === link.href
                      ? "text-brand-red"
                      : "text-brand-black hover:text-brand-red"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-red" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Admin button — desktop */}
              {isAdmin ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-xs font-semibold text-brand-red border border-brand-red px-3 py-1.5 hover:bg-brand-red hover:text-white transition-colors"
                  >
                    <Settings size={12} />
                    Admin
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-400 hover:text-brand-red transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-brand-red transition-colors"
                >
                  <User size={14} />
                  Admin Login
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-gray-50 rounded-sm transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-3.5 text-sm font-medium border-b border-gray-50 flex items-center justify-between ${
                    pathname === link.href
                      ? "text-brand-red bg-red-50"
                      : "text-brand-black"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                  )}
                </Link>
              ))}

              {/* Admin section in mobile menu */}
              <div className="border-t-2 border-gray-100 mt-1">
                {isAdmin ? (
                  <>
                    <Link
                      href="/admin"
                      className="px-6 py-3.5 text-sm font-semibold text-brand-red flex items-center gap-2 border-b border-gray-50"
                    >
                      <Settings size={15} />
                      Admin Panel
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="px-6 py-3 text-sm text-gray-500 flex items-center gap-2 border-b border-gray-50 pl-10"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/admin/custom-orders"
                      className="px-6 py-3 text-sm text-gray-500 flex items-center gap-2 border-b border-gray-50 pl-10"
                    >
                      Custom Orders
                    </Link>
                    <Link
                      href="/admin/products"
                      className="px-6 py-3 text-sm text-gray-500 flex items-center gap-2 border-b border-gray-50 pl-10"
                    >
                      Products
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-6 py-3 text-sm text-gray-400 flex items-center gap-2"
                    >
                      <User size={14} />
                      Logout ({user?.email})
                    </button>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    className="px-6 py-3.5 text-sm text-gray-500 flex items-center gap-2"
                  >
                    <User size={14} />
                    Admin Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-[calc(4rem+28px)]" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
