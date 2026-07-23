"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const { cart, setCart } = useContext(CartContext);

  return (
    <main className="min-h-screen pt-32 px-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="border rounded-xl p-10 text-center">
            <h2 className="text-2xl font-bold">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-4">
              Add some beautiful Kashmiri products.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {cart.map((item: any, index: number) => (
              <div
                key={index}
                className="border rounded-xl p-5 flex justify-between items-center"
              >
                {/* Product */}
                <div className="flex items-center gap-5">

                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />

                  <div>
                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p className="text-gray-500">
                      ₹{item.price}
                    </p>
                  </div>

                </div>

                {/* Quantity + Remove */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={() => {
                      const updatedCart = cart.filter(
                        (_: any, i: number) => i !== index
                      );
                      setCart(updatedCart);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        const updatedCart = cart.map((product: any) =>
                          product.id === item.id
                            ? {
                                ...product,
                                quantity: product.quantity - 1,
                              }
                            : product
                        );

                        setCart(updatedCart);
                      }
                    }}
                    className="w-10 h-10 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="text-lg font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => {
                      const updatedCart = cart.map((product: any) =>
                        product.id === item.id
                          ? {
                              ...product,
                              quantity: product.quantity + 1,
                            }
                          : product
                      );

                      setCart(updatedCart);
                    }}
                    className="w-10 h-10 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400"
                  >
                    +
                  </button>

                </div>

              </div>
            ))}

            {/* Total */}
            <div className="mt-8 border-t pt-6 flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                Total
              </h2>

              <h2 className="text-2xl font-bold text-yellow-600">
                ₹
                {cart.reduce(
                  (total: number, item: any) =>
                    total + item.price * item.quantity,
                  0
                )}
              </h2>

            </div>

            {/* Checkout Button */}
            <Link href="/checkout">
              <button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition">
                Proceed to Checkout
              </button>
            </Link>

          </div>
        )}

      </div>
    </main>
  );
}