"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductDetailsPage() {
  return (
    <main className="min-h-screen pt-32 px-8 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        {/* Left Side */}
        <div>

          <Image
            src="/images/shawl1.jpg"
            alt="Premium Shawl"
            width={700}
            height={700}
            className="rounded-2xl shadow-xl w-full"
          />

        </div>

        {/* Right Side */}
        <div>

          <h1 className="text-5xl font-bold">
            Premium Kashmiri Shawl
          </h1>

          <p className="text-yellow-600 text-3xl font-bold mt-6">
            ₹4,999
          </p>

          <p className="mt-6 text-gray-600 leading-8">
            Authentic handcrafted Kashmiri shawl made by experienced artisans.
            Soft, luxurious and perfect for every season.
          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full bg-yellow-500 hover:bg-yellow-400 py-4 rounded-xl font-bold">
              Add to Cart
            </button>

            <Link href="/cart">
              <button className="w-full border-2 border-black py-4 rounded-xl font-bold hover:bg-black hover:text-white transition">
                Go to Cart
              </button>
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}