"use client";

import { createContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string | number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};
export type WishlistItem = {
  id: string | number;
  title: string;
  price: number;
  image: string;
};
type CartContextType = {
  cart: CartItem[];
  wishlist: WishlistItem[];

addToWishlist: (
  product: WishlistItem
) => void;

removeFromWishlist: (
  id: string | number
) => void;

isInWishlist: (
  id: string | number
) => boolean;

  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string | number) => void;
  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;

  // NEW
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>(
  {} as CartContextType
);

export default function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
const addToWishlist = (product: WishlistItem) => {
  setWishlist((prev) => {
    const exists = prev.find(
      (item) => item.id === product.id
    );

    if (exists) return prev;

    return [...prev, product];
  });
};
  const removeFromCart = (id: string | number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };
const removeFromWishlist = (
  id: string | number
) => {
  setWishlist((prev) =>
    prev.filter((item) => item.id !== id)
  );
};
  const increaseQuantity = (id: string | number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: string | number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const isInWishlist = (
  id: string | number
) => {
  return wishlist.some(
    (item) => item.id === id
  );
};
// NEW
  const clearCart = () => {
    setCart([]);
  };

  return (
  <CartContext.Provider
  value={{
    cart,
    wishlist,

    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,

    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }}
>
 {children}
    </CartContext.Provider>
  );
}