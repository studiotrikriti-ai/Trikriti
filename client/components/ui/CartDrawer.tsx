"use client";

import { X, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-heading text-lg font-bold">
            Your Cart ({totalItems})
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-sm transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-gray-200" />
              <div>
                <p className="font-medium text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="btn-primary text-sm mt-2"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 pb-4 border-b border-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden shrink-0 relative">
                    <Image
                      src={item.image || "https://placehold.co/64x64/f5f5f5/ccc?text=?"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.isCustom && (
                      <span className="text-[10px] bg-brand-red text-white px-1.5 py-0.5 rounded-sm">
                        Custom
                      </span>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-sm">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.productId, item.quantity - 1)
                              : removeFromCart(item.productId)
                          }
                          className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-brand-red">
                        ₹{(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-400 hover:text-brand-red transition-colors shrink-0 mt-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-heading font-bold text-xl">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center block py-3"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              onClick={onClose}
              className="btn-outline w-full text-center block py-2.5 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
