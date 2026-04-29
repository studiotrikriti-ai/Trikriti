"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  isCustom: boolean;
  customNote?: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.productId === action.item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    case "LOAD":
      return { items: action.items };
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalAmount: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem("tks_cart");
    if (saved) dispatch({ type: "LOAD", items: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem("tks_cart", JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = state.items.reduce((acc, i) => acc + i.discountedPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart: (item) => dispatch({ type: "ADD", item }),
        removeFromCart: (id) => dispatch({ type: "REMOVE", productId: id }),
        updateQuantity: (id, qty) => dispatch({ type: "UPDATE_QTY", productId: id, quantity: qty }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
