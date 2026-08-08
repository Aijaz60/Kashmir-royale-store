"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-10 text-4xl font-bold">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-2xl font-bold">
              Your Cart is Empty
            </h2>

            <p className="mt-4 text-gray-500">
              Add some beautiful Kashmiri products.
            </p>

            <Link
              href="/#collections"
              className="mt-6 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">

            {cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex flex-col items-start justify-between gap-5 rounded-xl border bg-white p-5 md:flex-row md:items-center"
              >
                {/* Product */}
                <div className="flex items-center gap-5">

                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="h-[100px] w-[100px] rounded-lg object-cover"
                  />

                  <div>
                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p className="text-gray-500">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-wrap items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                    className="h-10 w-10 rounded-lg bg-gray-200 font-bold hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="text-lg font-bold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                    className="h-10 w-10 rounded-lg bg-yellow-500 font-bold text-black hover:bg-yellow-400"
                  >
                    +
                  </button>

                </div>

              </div>
            ))}

            {/* Total */}
            <div className="mt-8 flex items-center justify-between border-t pt-6">

              <h2 className="text-2xl font-bold">
                Total
              </h2>

              <h2 className="text-2xl font-bold text-yellow-600">
                ₹
                {cart
                  .reduce(
                    (total, item) =>
                      total +
                      item.price * item.quantity,
                    0
                  )
                  .toLocaleString("en-IN")}
              </h2>

            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-xl bg-yellow-500 py-4 text-center font-bold text-black transition hover:bg-yellow-400"
            >
              Proceed to Checkout
            </Link>

          </div>
        )}

      </div>
    </main>
  );
}