"use client";

import Link from "next/link";
import { useContext } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

export default function FloatingCart() {
  const { cart } = useContext(CartContext);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (cartCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[9999] flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-yellow-500 text-black shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-yellow-400"
    >
      <FaShoppingCart size={26} />

      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white animate-bounce">
        {cartCount}
      </span>
    </Link>
  );
}