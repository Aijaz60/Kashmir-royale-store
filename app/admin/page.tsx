"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState({
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  recentOrders: [] as any[],
  recentProducts: [] as any[],
});

  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
       setStats({
  totalProducts: data.totalProducts,
  totalOrders: data.totalOrders,
  totalRevenue: data.totalRevenue,
  pendingOrders: data.pendingOrders,
  shippedOrders: data.shippedOrders,
  deliveredOrders: data.deliveredOrders,
  recentOrders: data.recentOrders || [],
  recentProducts: data.recentProducts || [],
});
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Dashboard...</h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">📦 Total Products</h2>
            <p className="text-4xl font-bold mt-3">
              {stats.totalProducts}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">🛒 Total Orders</h2>
            <p className="text-4xl font-bold mt-3">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">💰 Total Revenue</h2>
            <p className="text-4xl font-bold mt-3">
              ₹{stats.totalRevenue}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">⏳ Pending Orders</h2>
            <p className="text-4xl font-bold text-yellow-600 mt-3">
              {stats.pendingOrders}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">🚚 Shipped Orders</h2>
            <p className="text-4xl font-bold text-purple-600 mt-3">
              {stats.shippedOrders}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">✅ Delivered Orders</h2>
            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats.deliveredOrders}
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <Link href="/admin/products">
            <div className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition cursor-pointer">
              <h2 className="text-2xl font-bold">
                📦 Manage Products
              </h2>

              <p className="text-gray-500 mt-2">
                Add, Edit and Delete Products
              </p>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition cursor-pointer">
              <h2 className="text-2xl font-bold">
                🛒 Manage Orders
              </h2>

              <p className="text-gray-500 mt-2">
                View and Update Orders
              </p>
            </div>
          </Link>

        </div>
{/* Recent Orders */}
<div className="mt-12">
  <h2 className="text-3xl font-bold mb-6">
    🛒 Recent Orders
  </h2>

  <div className="bg-white rounded-2xl shadow overflow-hidden">
    <table className="w-full">
      <thead className="bg-yellow-500 text-black">
        <tr>
          <th className="p-4 text-left">Customer</th>
          <th className="p-4 text-left">Amount</th>
          <th className="p-4 text-left">Status</th>
          <th className="p-4 text-left">View</th>
        </tr>
      </thead>

      <tbody>
        {stats.recentOrders.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-6 text-center">
              No Recent Orders
            </td>
          </tr>
        ) : (
          stats.recentOrders.map((order: any) => (
            <tr
              key={order._id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4">
                {order.customer?.name}
              </td>

              <td className="p-4 font-semibold">
                ₹{order.total}
              </td>

              <td className="p-4">
                {order.status}
              </td>

              <td className="p-4">
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-black"
                >
                  View
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

{/* Recent Products */}
<div className="mt-12 mb-10">
  <h2 className="text-3xl font-bold mb-6">
    📦 Recent Products
  </h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {stats.recentProducts.map((product: any) => (
      <div
        key={product._id}
        className="bg-white rounded-2xl shadow p-5"
      >
        <Image
          src={product.image}
          alt={product.title}
          width={300}
          height={220}
          className="rounded-xl h-52 w-full object-cover"
        />

        <h3 className="text-xl font-bold mt-4">
          {product.title}
        </h3>

        <p className="text-yellow-600 font-bold text-lg mt-2">
          ₹{product.price}
        </p>

        <Link
          href={`/admin/products/edit/${product._id}`}
          className="inline-block mt-4 bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg font-semibold"
        >
          Edit Product
        </Link>
      </div>
    ))}
  </div>
</div>
      </div>
    </main>
  );
}