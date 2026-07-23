"use client";
import { useContext } from "react";
import { CartContext } from "./context/CartContext";
import Collections from "./components/Collections";
import Hero from "./components/Hero";

import Navbar from "./components/Navbar";
export default function Home() {
  const { cart } = useContext(CartContext);

  return (
  <main className="min-h-screen bg-white">

    <Navbar cartCount={cart.length} />
<Hero />
<Collections />
            {/* Why Choose Us */}
      <section className="bg-gray-100 py-20 px-8">

        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-4 gap-8 text-center">

          <div>
            <h3 className="font-bold text-xl">
              Since 1995
            </h3>
            <p>Trusted Family Business</p>
          </div>

          <div>
            <h3 className="font-bold text-xl">
              Handcrafted
            </h3>
            <p>Made by Kashmiri Artisans</p>
          </div>

          <div>
            <h3 className="font-bold text-xl">
              Worldwide Shipping
            </h3>
            <p>India & International</p>
          </div>

          <div>
            <h3 className="font-bold text-xl">
              Premium Quality
            </h3>
            <p>Luxury Products</p>
          </div>

        </div>

      </section>

      {/* Contact */}
      <section className="bg-black text-white py-20 text-center">

        <h2 className="text-4xl font-bold">
          Contact Us
        </h2>

        <p className="mt-6">
          📍 Srinagar, Jammu & Kashmir
        </p>

        <p className="mt-3">
          📞 +91 7298129017
        </p>

        <p className="mt-2">
          📞 +91 7006819881
        </p>

      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">

        <div className="max-w-7xl mx-auto px-8">

          <div className="text-center">

            <h2 className="text-3xl font-bold text-yellow-400">
              Kashmir Royale
            </h2>

            <p className="mt-4 text-gray-400">
              Authentic Kashmiri Shawls, Pashmina & Luxury Suits Since 1995.
            </p>

          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">

            © 2026 Kashmir Royale. All Rights Reserved.

          </div>

        </div>

      </footer>

    </main>
  );
}