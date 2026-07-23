import Link from "next/link";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";

export default function Navbar({ cartCount }: { cartCount: number }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-yellow-500/20 text-white">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
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

        {/* Menu */}
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#" className="hover:text-yellow-400">Home</a>
          <a href="#" className="hover:text-yellow-400">Suits</a>
          <a href="#" className="hover:text-yellow-400">Shawls</a>
          <a href="#" className="hover:text-yellow-400">Pashmina</a>
          <a href="#" className="hover:text-yellow-400">Contact</a>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">

          <div className="cursor-pointer">
            <FaHeart className="text-xl hover:text-red-500 transition" />
          </div>

          <div className="cursor-pointer">
            <FaUser className="text-xl hover:text-yellow-400 transition" />
          </div>

          <Link href="/cart" className="relative cursor-pointer">
            <FaShoppingCart className="text-2xl text-white hover:text-yellow-400 transition" />

            <span className="absolute -top-1 -right-3 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
              {cartCount}
            </span>
          </Link>

          <button className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition duration-300 shadow-lg">
            Shop Now
          </button>

        </div>

      </div>
    </nav>
  );
}