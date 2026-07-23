"use client";

import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart } = useContext(CartContext);

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen pt-32 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Shipping Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h1 className="text-3xl font-bold mb-6">
            Checkout
          </h1>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border p-3 rounded-lg mb-4"
          />

          <textarea
            placeholder="Shipping Address"
            className="w-full border p-3 rounded-lg mb-4 h-32"
          />

        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-3xl font-bold mb-6">
            Order Summary
          </h2>

          {cart.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-4"
            >
              <div>
                <h3 className="font-bold">
                  {item.title}
                </h3>

                <p className="text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="font-bold">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}

          <div className="flex justify-between mt-8 text-2xl font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 py-4 rounded-xl font-bold text-black">
            Proceed to Payment
          </button>

        </div>

      </div>
    </main>
  );
}