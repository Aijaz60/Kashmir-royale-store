"use client";
import Image from "next/image";
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
  <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">

          <Image
            src="/logo.png"
            alt="Kashmir Royale Shawls"
            width={70}
            height={70}
            priority
            className="w-16 h-16 object-contain"
            unoptimized
          />

          <div>
            <h1 className="text-2xl font-bold text-white">
              Kashmir Royale Shawls
            </h1>

            <p className="text-sm text-gray-300">
              Authentic Kashmiri Shawls
            </p>

            <p className="text-xs text-yellow-400 uppercase tracking-[0.2em]">
              Since 1995
            </p>
          </div>

        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-8 font-medium">

          <Link href="/" className="hover:text-yellow-400 transition">
            Home
          </Link>

          <Link href="/#collections" className="hover:text-yellow-400 transition">
            Suits
          </Link>

          <Link href="/#collections" className="hover:text-yellow-400 transition">
            Shawls
          </Link>

          <Link href="/#collections" className="hover:text-yellow-400 transition">
            Pashmina
          </Link>

          <Link href="/contact" className="hover:text-yellow-400 transition">
            Contact
          </Link>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          <button>
            <FaHeart className="text-xl hover:text-red-500 transition" />
          </button>

          <button>
            <FaUser className="text-xl hover:text-yellow-400 transition" />
          </button>

          <Link href="/cart" className="relative">

            <FaShoppingCart className="text-2xl hover:text-yellow-400 transition" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}

          </Link>

          <Link href="/#collections">

            <button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105">
              Shop Now
            </button>

          </Link>

        </div>

      </div>
   </nav>
);
}
