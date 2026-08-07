"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from "react-icons/fa";

interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  logo: string;

  phone: string;
  phone2: string;
  whatsapp: string;

  announcementEnabled: boolean;
  announcementText: string;

  freeShippingAbove: string;
}

const defaultSettings: WebsiteSettings = {
  websiteName: "Kashmir Royale",
  tagline: "Authentic Kashmiri Shawls Since 1995",
  logo: "/logo.png",

  phone: "+91 7298129017",
  phone2: "+91 7006819881",
  whatsapp: "+91 7006819881",

  announcementEnabled: true,
  announcementText:
    "🚚 FREE SHIPPING ABOVE ₹5000 • 🌍 WORLDWIDE SHIPPING",

  freeShippingAbove: "5000",
};

export default function Navbar() {
  const { cart, wishlist } = useContext(CartContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [settings, setSettings] =
    useState<WebsiteSettings>(defaultSettings);
const cartCount = cart.reduce(
  (total, item) => total + item.quantity,
  0
);
  const wishlistCount = wishlist.length;

 

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.success) {
        setSettings({
          ...defaultSettings,
          ...data.settings,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
   useEffect(() => {
    loadSettings();
  }, []);

  const menuItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Collections",
      href: "/#collections",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ];
    return (
    <>
      {settings.announcementEnabled && (
        <div className="fixed top-0 left-0 z-[60] w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 py-2 text-center text-xs font-semibold text-black md:text-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4">
            <span>{settings.announcementText}</span>

            <span className="hidden md:inline">•</span>

            <span>📞 {settings.phone}</span>

            <span className="hidden md:inline">•</span>

            <span>📞 {settings.phone2}</span>
          </div>
        </div>
      )}

      <nav
        className={`fixed left-0 z-50 w-full border-b border-yellow-500/20 bg-black/90 text-white shadow-xl backdrop-blur-lg ${
          settings.announcementEnabled ? "top-10" : "top-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src={settings.logo || "/logo.png"}
              alt={settings.websiteName}
              width={70}
              height={70}
              priority
              className="h-16 w-16 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold">
                {settings.websiteName}
              </h1>

              <p className="text-sm text-gray-300">
                {settings.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 lg:flex">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="transition hover:text-yellow-400"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-5 lg:flex">
           <Link href="/wishlist" className="relative">
  <FaHeart className="text-xl transition hover:text-red-500" />

  {wishlistCount > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
      {wishlistCount}
    </span>
  )}
</Link>

            <button>
              <FaUser className="text-xl transition hover:text-yellow-400" />
            </button>
<Link
  href="/wishlist"
  onClick={() => setMobileMenuOpen(false)}
  className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/30 p-4"
>
  <FaHeart />
  Wishlist ({wishlistCount})
</Link>
            <Link href="/cart" className="relative">
              <FaShoppingCart className="text-2xl transition hover:text-yellow-400" />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/#collections">
              <button className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-3 font-bold text-black transition hover:scale-105">
                Shop Now
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl lg:hidden"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-yellow-500/20 bg-black/95 lg:hidden">
            <div className="flex flex-col px-6 py-5">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-gray-800 py-4 text-lg hover:text-yellow-400"
                >
                  {item.title}
                </Link>
              ))}

              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-5 flex items-center gap-3 rounded-xl border border-yellow-500/30 p-4"
              >
                <FaShoppingCart />
                Cart ({cartCount})
              </Link>

              <Link
                href="/#collections"
                onClick={() => setMobileMenuOpen(false)}
              >
                <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 py-4 font-bold text-black">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
