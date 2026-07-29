"use client";

import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";

export default function Navbar() {
  const { cart } = useContext(CartContext);

  const cartCount = cart.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-yellow-500/20 text-white">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <div>
            <h1 className="text-2xl font-extrabold tracking-widest text-yellow-400">
              KR
            </h1>

            <p className="text-sm font-semibold">
              Kashmir Royale
            </p>

            <p className="text-xs text-yellow-300">
              Since 1995
            </p>
          </div>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-8 font-medium">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          <Link href="/#collections" className="hover:text-yellow-400">Suits</Link>
          <Link href="/#collections" className="hover:text-yellow-400">Shawls</Link>
          <Link href="/#collections" className="hover:text-yellow-400">Pashmina</Link>
          <Link href="/contact" className="hover:text-yellow-400">Contact</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">

          <button className="cursor-pointer">
            <FaHeart className="text-xl hover:text-red-500 transition" />
          </button>

          <button className="cursor-pointer">
            <FaUser className="text-xl hover:text-yellow-400 transition" />
          </button>

          <Link href="/cart" className="relative">
            <FaShoppingCart className="text-2xl hover:text-yellow-400 transition" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/#collections">
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">
              Shop Now
            </button>
          </Link>

        </div>

      </div>
    </nav>
  );
}