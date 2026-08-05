"use client";
import RevenueChart from "../components/RevenueChart";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState({

    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
todayRevenue: 0,
averageOrderValue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    lowStockProducts: 0,
    recentOrders: [] as any[],
    recentProducts: [] as any[],
    monthlyRevenue: [] as any[],
    topSellingProducts: [] as any[],
  });

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("all");

  async function loadDashboard() {
    try {
     const res = await fetch(`/api/dashboard?range=${range}`, {
  cache: "no-store",
});

      const data = await res.json();

      if (data.success) {
        setStats({
          totalProducts: data.totalProducts,
          totalOrders: data.totalOrders,
          totalRevenue: data.totalRevenue,
          totalCustomers: data.totalCustomers,
          todayRevenue: data.todayRevenue,
          averageOrderValue: data.averageOrderValue, 
          pendingOrders: data.pendingOrders,
          shippedOrders: data.shippedOrders,
          deliveredOrders: data.deliveredOrders,
          lowStockProducts: data.lowStockProducts,
          recentOrders: data.recentOrders || [],
          recentProducts: data.recentProducts || [],
          monthlyRevenue: data.monthlyRevenue || [],
          topSellingProducts: data.topSellingProducts || [],
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
}, [range]);
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-3xl font-bold animate-pulse">
          Loading Dashboard...
        </h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-extrabold mb-10">
          Admin Dashboard
        </h1>
<div className="flex flex-wrap gap-3 mb-8">
  {[
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
    { label: "All Time", value: "all" },
  ].map((item) => (
    <button
      key={item.value}
      onClick={() => setRange(item.value)}
      className={`px-5 py-2 rounded-full font-semibold transition ${
        range === item.value
          ? "bg-yellow-500 text-black"
          : "bg-white border hover:bg-yellow-100"
      }`}
    >
      {item.label}
    </button>
  ))}
</div>
        {/* Dashboard Cards */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
            <p className="text-gray-500 text-sm uppercase">
              📦 Products
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {stats.totalProducts}
            </h2>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
            <p className="text-gray-500 text-sm uppercase">
              🛒 Orders
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {stats.totalOrders}
            </h2>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
            <p className="text-gray-500 text-sm uppercase">
              💰 Revenue
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-3">
              ₹{stats.totalRevenue.toLocaleString()}
            </h2>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
  <p className="text-gray-500 text-sm uppercase">
    👥 Customers
  </p>

  <h2 className="text-4xl font-bold text-blue-600 mt-3">
    {stats.totalCustomers}
  </h2>
</div>
<div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
  <p className="text-gray-500 text-sm uppercase">
    💰 Today Revenue
  </p>

  <h2 className="text-4xl font-bold text-green-600 mt-3">
    ₹{stats.todayRevenue.toLocaleString()}
  </h2>
</div>
<div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
  <p className="text-gray-500 text-sm uppercase">
    💳 Average Order
  </p>

  <h2 className="text-4xl font-bold text-purple-600 mt-3">
    ₹{stats.averageOrderValue.toLocaleString()}
  </h2>
</div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
            <p className="text-gray-500 text-sm uppercase">
              ⏳ Pending
            </p>

            <h2 className="text-4xl font-bold text-yellow-600 mt-3">
              {stats.pendingOrders}
            </h2>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
            <p className="text-gray-500 text-sm uppercase">
              🚚 Shipped
            </p>

            <h2 className="text-4xl font-bold text-purple-600 mt-3">
              {stats.shippedOrders}
            </h2>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition p-6">
            <p className="text-gray-500 text-sm uppercase">
              ✅ Delivered
            </p>

            <h2 className="text-4xl font-bold text-green-700 mt-3">
              {stats.deliveredOrders}
            </h2>
            </div>

            <div className="bg-white border border-red-200 rounded-2xl shadow-md hover:shadow-xl transition p-6">
  <p className="text-gray-500 text-sm uppercase">
    ⚠️ Low Stock
  </p>

  <h2 className="text-4xl font-bold text-red-600 mt-3">
    {stats.lowStockProducts}
  </h2>

  <p className="text-sm text-gray-500 mt-2">
    Products need restocking
  </p>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <Link href="/admin/products">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 cursor-pointer border border-gray-100">
              <h2 className="text-2xl font-bold">
                📦 Manage Products
              </h2>

              <p className="text-gray-500 mt-2">
                Add, edit and delete products
              </p>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 cursor-pointer border border-gray-100">
              <h2 className="text-2xl font-bold">
                🛒 Manage Orders
              </h2>

              <p className="text-gray-500 mt-2">
                View and update customer orders
              </p>
            </div>
          </Link>

        </div>
        <RevenueChart data={stats.monthlyRevenue} />

        {/* Recent Orders */}

        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">
            🛒 Recent Orders
          </h2>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">

            <table className="w-full">

              <thead className="bg-yellow-500 text-black">

                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>

              </thead>

              <tbody>

                {stats.recentOrders.length === 0 ? (

                  <tr>
                    <td
                      colSpan={4}
                      className="text-center p-8 text-gray-500"
                    >
                      No Recent Orders
                    </td>
                  </tr>

                ) : (

                  stats.recentOrders.map((order: any) => (

                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="p-4 font-medium">
                        {order.customer?.name}
                      </td>

                      <td className="p-4 font-bold">
                        ₹{order.total}
                      </td>

                      <td className="p-4">

                        <span
                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
  order.orderStatus === "Delivered"
    ? "bg-green-100 text-green-700"
    : order.orderStatus === "Shipped"
    ? "bg-purple-100 text-purple-700"
    : order.orderStatus === "Confirmed"
    ? "bg-blue-100 text-blue-700"
    : order.orderStatus === "Cancelled"
    ? "bg-red-100 text-red-700"
    : "bg-yellow-100 text-yellow-700"
}`}
                        >
                          {order.orderStatus}
                        </span>

                      </td>

                      <td className="p-4">

                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
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
{/* Top Selling Products */}
<div className="mt-12">
  <h2 className="text-3xl font-bold mb-6">
    🏆 Top Selling Products
  </h2>

  <div className="bg-white rounded-2xl shadow p-6">
    {stats.topSellingProducts.length === 0 ? (
      <p className="text-gray-500">
        No sales yet.
      </p>
    ) : (
      <div className="space-y-4">
        {stats.topSellingProducts.map((product: any, index: number) => (
          <div
            key={product._id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div className="flex items-center gap-4">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product._id}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center">
                  📦
                </div>
              )}

              <div>
                <h3 className="font-bold">
                  {index + 1}. {product._id}
                </h3>

                <p className="text-gray-500 text-sm">
                  Total Sold: {product.totalSold}
                </p>
              </div>
            </div>

            <span className="text-green-600 font-bold">
              {product.totalSold} pcs
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
        {/* Recent Products */}

        <div className="mt-12 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            📦 Recent Products
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentProducts.length === 0 ? (

              <p className="text-gray-500">
                No Products Found
              </p>

            ) : (

              stats.recentProducts.map((product: any) => (

                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100 overflow-hidden"
                >

                  {product.image && product.image.trim() ? (

                    <Image
                      src={product.image}
                      alt={product.title || "Product"}
                      width={400}
                      height={300}
                      className="w-full h-60 object-cover"
                    />

                  ) : (

                    <div className="w-full h-60 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>

                  )}

                  <div className="p-5">

                    <h3 className="text-xl font-bold line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="text-yellow-600 text-2xl font-bold mt-3">
                      ₹{product.price}
                    </p>

                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="mt-5 block w-full text-center bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                      Edit Product
                    </Link>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </main>
  );
}