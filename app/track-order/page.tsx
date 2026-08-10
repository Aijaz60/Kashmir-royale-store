"use client";

import { FormEvent, useState } from "react";

interface Order {
  orderId: string;
  paymentStatus: string;
  orderStatus: string;
  total: number;
  createdAt: string;
  customer?: {
    name?: string;
  };
  cart?: {
    title: string;
    quantity: number;
    price: number;
  }[];
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setOrder(null);

    if (!orderId.trim() || !phone.trim()) {
      setError("Please enter your Order ID and phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Order not found. Please check your details."
        );
        return;
      }

      setOrder(data.order);
    } catch (error) {
      console.error(error);
      setError("Unable to track your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
  ];

  const currentIndex = statuses.findIndex(
    (status) =>
      status.toLowerCase() ===
      order?.orderStatus?.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-16 pt-32">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Track Your Order
          </h1>

          <p className="mt-3 text-gray-600">
            Enter your Order ID and phone number to check
            your order status.
          </p>
        </div>

        {/* Search Box */}
        <form
          onSubmit={trackOrder}
          className="rounded-2xl bg-white p-6 shadow-md"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-semibold">
                Order ID
              </label>

              <input
                type="text"
                value={orderId}
                onChange={(e) =>
                  setOrderId(e.target.value)
                }
                placeholder="e.g. order_TNcq21X8sMOWM0"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter the phone number used for the order"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-yellow-500 py-4 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50"
            >
              {loading
                ? "Checking Order..."
                : "Track Order"}
            </button>
          </div>
        </form>

        {/* Order Result */}
        {order && (
          <div className="mt-8 space-y-6">
            {/* Order Info */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <h2 className="mt-1 break-all text-lg font-bold">
                    {order.orderId}
                  </h2>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm text-gray-500">
                    Order Status
                  </p>

                  <p className="mt-1 text-lg font-bold text-yellow-600">
                    {order.orderStatus}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <p className="font-semibold">
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="font-semibold">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Order Date
                  </p>

                  <p className="font-semibold">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-6 text-2xl font-bold">
                Order Progress
              </h2>

              <div className="space-y-5">
                {statuses.map((status, index) => {
                  const completed =
                    currentIndex >= index;

                  return (
                    <div
                      key={status}
                      className="flex items-center gap-4"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                          completed
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <div>
                        <p
                          className={`font-semibold ${
                            completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {status}
                        </p>

                        {status === "Pending" && (
                          <p className="text-sm text-gray-500">
                            Your order has been received.
                          </p>
                        )}

                        {status === "Confirmed" && (
                          <p className="text-sm text-gray-500">
                            Your order has been confirmed.
                          </p>
                        )}

                        {status === "Shipped" && (
                          <p className="text-sm text-gray-500">
                            Your order is on its way.
                          </p>
                        )}

                        {status === "Delivered" && (
                          <p className="text-sm text-gray-500">
                            Your order has been delivered.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Products */}
            {order.cart && order.cart.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h2 className="mb-5 text-2xl font-bold">
                  Your Items
                </h2>

                <div className="space-y-4">
                  {order.cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.title}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}