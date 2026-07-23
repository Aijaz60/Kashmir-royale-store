"use client";

import { createContext } from "react";
import { useState } from "react";
export const CartContext = createContext<any>(null);
export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
 const [cart, setCart] = useState<any[]>([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}