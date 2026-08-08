"use client";

import RevenueChart from "../components/RevenueChart";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface RecentOrder {
  _id: string;
  customer?: {
    name?: string;
  };
  total: number;
  orderStatus: string;
}

interface RecentProduct {
  _id: string;
  title?: string;
  price: number;
  image?: string;
}

interface MonthlyRevenue {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
}


interface TopSellingProduct {
  _id: string;
  image?: string;
  totalSold: number;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  todayRevenue: number;
  averageOrderValue: number;

  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;

  recentOrders: RecentOrder[];
  recentProducts: RecentProduct[];
  monthlyRevenue: MonthlyRevenue[];
  topSellingProducts: TopSellingProduct[];
}

interface DashboardResponse {
  success?: boolean;

  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  totalCustomers?: number;
  todayRevenue?: number;
  averageOrderValue?: number;

  pendingOrders?: number;
  shippedOrders?: number;
  deliveredOrders?: number;
  lowStockProducts?: number;

  recentOrders?: RecentOrder[];
  recentProducts?: RecentProduct[];
  monthlyRevenue?: MonthlyRevenue[];
  topSellingProducts?: TopSellingProduct[];
}

const defaultStats: DashboardStats = {
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

  recentOrders: [],
  recentProducts: [],
  monthlyRevenue: [],
  topSellingProducts: [],
};

export default function AdminPage() {
  const [stats, setStats] =
    useState<DashboardStats>(defaultStats);

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("all");

  /*
   * Load dashboard data
   *
   * The fetch is directly inside useEffect so
   * there is no loadDashboard declaration-order
   * or missing dependency problem.
   */
  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        const res = await fetch(
          `/api/dashboard?range=${range}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to load dashboard"
          );
        }

        const data =
          (await res.json()) as DashboardResponse;

        if (cancelled) {
          return;
        }

        if (data.success) {
          setStats({
            totalProducts:
              data.totalProducts ?? 0,

            totalOrders:
              data.totalOrders ?? 0,

            totalRevenue:
              data.totalRevenue ?? 0,

            totalCustomers:
              data.totalCustomers ?? 0,

            todayRevenue:
              data.todayRevenue ?? 0,

            averageOrderValue:
              data.averageOrderValue ?? 0,

            pendingOrders:
              data.pendingOrders ?? 0,

            shippedOrders:
              data.shippedOrders ?? 0,

            deliveredOrders:
              data.deliveredOrders ?? 0,

            lowStockProducts:
              data.lowStockProducts ?? 0,

            recentOrders:
              data.recentOrders ?? [],

            recentProducts:
              data.recentProducts ?? [],

            monthlyRevenue:
              data.monthlyRevenue ?? [],

            topSellingProducts:
              data.topSellingProducts ?? [],
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, [range]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <h2 className="animate-pulse text-3xl font-bold">
          Loading Dashboard...
        </h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-8 pt-32">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-10 text-5xl font-extrabold">
          Admin Dashboard
        </h1>

        {/* Date Range */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            {
              label: "Today",
              value: "today",
            },
            {
              label: "This Week",
              value: "week",
            },
            {
              label: "This Month",
              value: "month",
            },
            {
              label: "This Year",
              value: "year",
            },
            {
              label: "All Time",
              value: "all",
            },
          ].map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() =>
                setRange(item.value)
              }
              className={`rounded-full px-5 py-2 font-semibold transition ${
                range === item.value
                  ? "bg-yellow-500 text-black"
                  : "border bg-white hover:bg-yellow-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              📦 Products
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {stats.totalProducts}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              🛒 Orders
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {stats.totalOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              💰 Revenue
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              👥 Customers
            </p>

            <h2 className="mt-3 text-4xl font-bold text-blue-600">
              {stats.totalCustomers}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              💰 Today Revenue
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-600">
              ₹{stats.todayRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              💳 Average Order
            </p>

            <h2 className="mt-3 text-4xl font-bold text-purple-600">
              ₹
              {stats.averageOrderValue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              ⏳ Pending
            </p>

            <h2 className="mt-3 text-4xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              🚚 Shipped
            </p>

            <h2 className="mt-3 text-4xl font-bold text-purple-600">
              {stats.shippedOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              ✅ Delivered
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-700">
              {stats.deliveredOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-md transition hover:shadow-xl">
            <p className="text-sm uppercase text-gray-500">
              ⚠️ Low Stock
            </p>

            <h2 className="mt-3 text-4xl font-bold text-red-600">
              {stats.lowStockProducts}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Products need restocking
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <Link href="/admin/products">
            <div className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition hover:shadow-xl">
              <h2 className="text-2xl font-bold">
                📦 Manage Products
              </h2>

              <p className="mt-2 text-gray-500">
                Add, edit and delete products
              </p>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition hover:shadow-xl">
              <h2 className="text-2xl font-bold">
                🛒 Manage Orders
              </h2>

              <p className="mt-2 text-gray-500">
                View and update customer orders
              </p>
            </div>
          </Link>

        </div>

        <RevenueChart
          data={stats.monthlyRevenue}
        />

        {/* Recent Orders */}
        <div className="mt-12">

          <h2 className="mb-6 text-3xl font-bold">
            🛒 Recent Orders
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">

            <table className="w-full">

              <thead className="bg-yellow-500 text-black">
                <tr>
                  <th className="p-4 text-left">
                    Customer
                  </th>

                  <th className="p-4 text-left">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-gray-500"
                    >
                      No Recent Orders
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map(
                    (order) => (
                      <tr
                        key={order._id}
                        className="border-b transition hover:bg-gray-50"
                      >

                        <td className="p-4 font-medium">
                          {order.customer?.name ||
                            "Unknown Customer"}
                        </td>

                        <td className="p-4 font-bold">
                          ₹
                          {order.total.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="p-4">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              order.orderStatus ===
                              "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus ===
                                  "Shipped"
                                ? "bg-purple-100 text-purple-700"
                                : order.orderStatus ===
                                  "Confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : order.orderStatus ===
                                  "Cancelled"
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
                            className="inline-block rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
                          >
                            View
                          </Link>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* Top Selling Products */}
        <div className="mt-12">

          <h2 className="mb-6 text-3xl font-bold">
            🏆 Top Selling Products
          </h2>

          <div className="rounded-2xl bg-white p-6 shadow">

            {stats.topSellingProducts.length === 0 ? (
              <p className="text-gray-500">
                No sales yet.
              </p>
            ) : (
              <div className="space-y-4">

                {stats.topSellingProducts.map(
                  (product, index) => (
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
                          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-gray-200">
                            📦
                          </div>
                        )}

                        <div>
                          <h3 className="font-bold">
                            {index + 1}. {product._id}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Total Sold:{" "}
                            {product.totalSold}
                          </p>
                        </div>

                      </div>

                      <span className="font-bold text-green-600">
                        {product.totalSold} pcs
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        </div>

        {/* Recent Products */}
        <div className="mb-10 mt-12">

          <h2 className="mb-6 text-3xl font-bold">
            📦 Recent Products
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {stats.recentProducts.length === 0 ? (
              <p className="text-gray-500">
                No Products Found
              </p>
            ) : (
              stats.recentProducts.map(
                (product) => (
                  <div
                    key={product._id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:shadow-xl"
                  >

                    {product.image &&
                    product.image.trim() ? (
                      <Image
                        src={product.image}
                        alt={
                          product.title ||
                          "Product"
                        }
                        width={400}
                        height={300}
                        className="h-60 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-60 w-full items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}

                    <div className="p-5">

                      <h3 className="line-clamp-2 text-xl font-bold">
                        {product.title}
                      </h3>

                      <p className="mt-3 text-2xl font-bold text-yellow-600">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className="mt-5 block w-full rounded-xl bg-black py-3 text-center text-white transition hover:bg-gray-800"
                      >
                        Edit Product
                      </Link>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>
    </main>
  );
}