"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

export default function WishlistPage() {
  const {
    wishlist,
    addToCart,
    removeFromWishlist,
  } = useContext(CartContext);

  if (wishlist.length === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 pt-32 px-6">
          <div className="mx-auto max-w-5xl text-center">

            <FaHeart className="mx-auto text-7xl text-red-500" />

            <h1 className="mt-6 text-5xl font-bold">
              Your Wishlist
            </h1>

            <p className="mt-4 text-lg text-gray-500">
              Your wishlist is empty.
            </p>

            <Link
              href="/#collections"
              className="mt-8 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black transition hover:bg-yellow-400"
            >
              Continue Shopping
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

 return (
  <>
    <Navbar />

      <main className="min-h-screen bg-gray-50 pt-32 px-6">
        <div className="mx-auto max-w-7xl">

          <h1 className="mb-10 text-5xl font-bold">
            ❤️ My Wishlist
          </h1>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          </div>
                    {wishlist.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-2xl"
            >
              <Link href={`/product/${item.id}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={500}
                  className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>

              <div className="p-6">
                <Link href={`/product/${item.id}`}>
                  <h2 className="line-clamp-2 text-2xl font-bold hover:text-yellow-600">
                    {item.title}
                  </h2>
                </Link>

                <p className="mt-4 text-3xl font-bold text-yellow-600">
                  ₹{item.price.toLocaleString()}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 font-bold text-black transition hover:bg-yellow-400"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                                    <button
                    onClick={() =>
                      removeFromWishlist(item.id)
                    }
                    className="flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>

                <Link
                  href={`/product/${item.id}`}
                  className="mt-4 block rounded-xl border-2 border-black py-3 text-center font-bold transition hover:bg-black hover:text-white"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
                  </div>
      </main>

      <Footer />
    </>
  );
}