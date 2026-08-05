"use client";

import Collections from "./components/Collections";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Hero />

      <FeaturedProducts />

      <Collections />

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="rounded-full border border-yellow-500 bg-yellow-100 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-yellow-700">
              Why Choose Kashmir Royale
            </span>

            <h2 className="mt-6 text-4xl font-extrabold md:text-5xl">
              Luxury Crafted With Tradition
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
              Every shawl and suit reflects authentic Kashmiri craftsmanship,
              premium quality and decades of trust.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-5 text-5xl">🏆</div>
              <h3 className="text-2xl font-bold">Since 1995</h3>
              <p className="mt-3 text-gray-600">
                Trusted family business serving customers for decades.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-5 text-5xl">🧵</div>
              <h3 className="text-2xl font-bold">Handcrafted</h3>
              <p className="mt-3 text-gray-600">
                Every product is made by skilled Kashmiri artisans.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-5 text-5xl">🌍</div>
              <h3 className="text-2xl font-bold">Worldwide Shipping</h3>
              <p className="mt-3 text-gray-600">
                Fast and secure delivery across India and internationally.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-5 text-5xl">💎</div>
              <h3 className="text-2xl font-bold">Premium Quality</h3>
              <p className="mt-3 text-gray-600">
                Finest fabrics selected for elegance and durability.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-5 text-5xl">🔒</div>
              <h3 className="text-2xl font-bold">Secure Payments</h3>
              <p className="mt-3 text-gray-600">
                Safe checkout with trusted payment gateways.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-5 text-5xl">🎁</div>
              <h3 className="text-2xl font-bold">Luxury Packaging</h3>
              <p className="mt-3 text-gray-600">
                Beautiful packaging for gifting and premium presentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}