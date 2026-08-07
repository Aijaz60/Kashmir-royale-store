"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RefreshCcw,
  Eye,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Download,
  LogOut,
  IndianRupee,
  ShoppingBag,
  Clock3,
  CircleCheckBig,
  Package,
  Ban,
  CreditCard,
  Wallet,
  Loader2,
} from "lucide-react";

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
}

type PaymentStatus = "Pending" | "Paid" | "Failed" | string;

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | string;

interface Order {
  _id: string;
  orderId: string;
  paymentId?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  total: number;
  createdAt: string;
  customer: Customer;
}

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const statusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h2 className="mt-3 text-3xl font-bold text-gray-900">{value}</h2>
      </div>

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const refreshOrders = async () => {
    try {
      setRefreshing(true);
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  };

  const stats: DashboardStats = useMemo(() => {
    return {
      totalOrders: orders.length,
      revenue: orders
        .filter((o) => o.paymentStatus?.toLowerCase() === "paid")
        .reduce((sum, o) => sum + Number(o.total || 0), 0),

      pending: orders.filter(
        (o) => o.orderStatus?.toLowerCase() === "pending"
      ).length,

      confirmed: orders.filter(
        (o) => o.orderStatus?.toLowerCase() === "confirmed"
      ).length,

      shipped: orders.filter(
        (o) => o.orderStatus?.toLowerCase() === "shipped"
      ).length,

      delivered: orders.filter(
        (o) => o.orderStatus?.toLowerCase() === "delivered"
      ).length,

      cancelled: orders.filter(
        (o) => o.orderStatus?.toLowerCase() === "cancelled"
      ).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        order.customer?.name?.toLowerCase().includes(keyword) ||
        order.customer?.email?.toLowerCase().includes(keyword) ||
        order.customer?.phone?.toLowerCase().includes(keyword) ||
        order.orderId?.toLowerCase().includes(keyword) ||
        order.paymentId?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === "All" ||
        order.paymentStatus?.toLowerCase() === paymentFilter.toLowerCase();

      const matchesMethod =
        methodFilter === "All" ||
        order.paymentMethod?.toLowerCase() === methodFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesMethod
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    methodFilter,
  ]);

  const updateStatus = async (
    id: string,
    status: OrderStatus
  ) => {
    try {
      setUpdatingId(id);

      const res = await fetch(`/api/update-order-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? {
                ...order,
                orderStatus: status,
              }
            : order
        )
      );

      if (selectedOrder?._id === id) {
        setSelectedOrder({
          ...selectedOrder,
          orderStatus: status,
        });
      }
    } catch (error) {
      console.error(error);
      alert("Unable to update order.");
    } finally {
      setUpdatingId("");
    }
  };

  const exportExcel = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Phone",
      "Payment ID",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Total",
      "Created",
    ];

    const rows = filteredOrders.map((order) => [
      order.orderId,
      order.customer?.name ?? "",
      order.customer?.email ?? "",
      order.customer?.phone ?? "",
      order.paymentId ?? "",
      order.paymentMethod ?? "",
      order.paymentStatus ?? "",
      order.orderStatus ?? "",
      order.total,
      new Date(order.createdAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "orders.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const logout = async () => {
    try {
      await fetch("/api/admin-logout", {
        method: "POST",
      });

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kashmir Royale
            </h1>

            <p className="text-sm text-gray-500">
              Premium Orders Administration
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refreshOrders}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium transition hover:bg-gray-100 disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}

              Refresh
            </button>

            <button
              onClick={exportExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" />
              Export
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 p-6">

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">

          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            color="bg-blue-100"
            icon={<ShoppingBag className="h-7 w-7 text-blue-700" />}
          />

          <StatCard
            title="Revenue"
            value={currency.format(stats.revenue)}
            color="bg-green-100"
            icon={<IndianRupee className="h-7 w-7 text-green-700" />}
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            color="bg-yellow-100"
            icon={<Clock3 className="h-7 w-7 text-yellow-700" />}
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            color="bg-blue-100"
            icon={<CircleCheckBig className="h-7 w-7 text-blue-700" />}
          />

          <StatCard
            title="Shipped"
            value={stats.shipped}
            color="bg-purple-100"
            icon={<Truck className="h-7 w-7 text-purple-700" />}
          />

          <StatCard
            title="Delivered"
            value={stats.delivered}
            color="bg-green-100"
            icon={<PackageCheck className="h-7 w-7 text-green-700" />}
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            color="bg-red-100"
            icon={<Ban className="h-7 w-7 text-red-700" />}
          />
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-4">

            <div className="relative lg:col-span-1">
              <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="Search customer, order or payment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
            >
              <option>All</option>
              <option>Razorpay</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Net Banking</option>
              <option>Wallet</option>
              <option>COD</option>
            </select>

          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-50">

                <tr className="text-left text-sm font-semibold uppercase tracking-wide text-gray-600">

                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-center">Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredOrders.length === 0 && (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-gray-500"
                    >
                      No orders found.
                    </td>

                  </tr>

                )}

                {filteredOrders.map((order) => (

                  <tr
                    key={order._id}
                    className="border-t border-gray-200 transition hover:bg-gray-50"
                  >

                    <td className="px-6 py-5 align-top">

                      <div className="font-semibold text-gray-900">
                        {order.customer?.name || "N/A"}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        {order.customer?.email || "N/A"}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        {order.customer?.phone || "N/A"}
                      </div>

                    </td>

                    <td className="px-6 py-5 align-top">

                      <div className="font-semibold text-gray-900">
                        {order.orderId}
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Payment ID
                      </div>

                      <div className="break-all text-sm text-gray-700">
                        {order.paymentId || "-"}
                      </div>

                    </td>

                    <td className="px-6 py-5 align-top">

                      <div className="flex items-center gap-2">

                        {order.paymentMethod?.toLowerCase().includes("razor") && (
                          <CreditCard className="h-4 w-4 text-indigo-600" />
                        )}

                        {!order.paymentMethod
                          ?.toLowerCase()
                          .includes("razor") && (
                          <Wallet className="h-4 w-4 text-emerald-600" />
                        )}

                        <span className="font-medium">
                          {order.paymentMethod}
                        </span>

                      </div>

                      <span
                        className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>

                    </td>

                    <td className="px-6 py-5 align-top">

                      <span className="font-bold text-emerald-700">
                        {currency.format(order.total)}
                      </span>

                    </td>

                    <td className="px-6 py-5 align-top">

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                    </td>

                    <td className="px-6 py-5 align-top whitespace-nowrap text-sm text-gray-600">

                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}

                      <div className="mt-1 text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex flex-wrap justify-center gap-2">

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg bg-slate-900 p-2 text-white transition hover:bg-black"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          disabled={updatingId === order._id}
                          onClick={() =>
                            updateStatus(order._id, "Confirmed")
                          }
                          className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                          title="Confirm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>

                        <button
                          disabled={updatingId === order._id}
                          onClick={() =>
                            updateStatus(order._id, "Shipped")
                          }
                          className="rounded-lg bg-purple-600 p-2 text-white transition hover:bg-purple-700 disabled:opacity-50"
                          title="Ship"
                        >
                          <Truck className="h-4 w-4" />
                        </button>

                        <button
                          disabled={updatingId === order._id}
                          onClick={() =>
                            updateStatus(order._id, "Delivered")
                          }
                          className="rounded-lg bg-green-600 p-2 text-white transition hover:bg-green-700 disabled:opacity-50"
                          title="Deliver"
                        >
                          <Package className="h-4 w-4" />
                        </button>

                        <button
                          disabled={updatingId === order._id}
                          onClick={() =>
                            updateStatus(order._id, "Cancelled")
                          }
                          className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                          title="Cancel"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

        {selectedOrder && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review customer, payment and shipping information.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-gray-300 p-2 transition hover:bg-gray-100"
                >
                  <XCircle className="h-6 w-6 text-gray-700" />
                </button>

              </div>

              <div className="space-y-8 p-8">

                <div className="grid gap-6 md:grid-cols-2">

                  <div className="rounded-2xl border border-gray-200 p-6">

                    <h3 className="mb-5 text-lg font-bold text-gray-900">
                      Customer Details
                    </h3>

                    <div className="space-y-4">

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Name
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                          {selectedOrder.customer?.name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Email
                        </p>

                        <p className="mt-1 break-all text-gray-700">
                          {selectedOrder.customer?.email || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Phone
                        </p>

                        <p className="mt-1 text-gray-700">
                          {selectedOrder.customer?.phone || "N/A"}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="rounded-2xl border border-gray-200 p-6">

                    <h3 className="mb-5 text-lg font-bold text-gray-900">
                      Payment Details
                    </h3>

                    <div className="space-y-4">

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Payment ID
                        </p>

                        <p className="mt-1 break-all font-medium text-gray-900">
                          {selectedOrder.paymentId || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Method
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Payment Status
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusBadge(
                            selectedOrder.paymentStatus
                          )}`}
                        >
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Total Amount
                        </p>

                        <p className="mt-1 text-2xl font-bold text-emerald-700">
                          {currency.format(selectedOrder.total)}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                <div className="rounded-2xl border border-gray-200 p-6">

                  <h3 className="mb-6 text-lg font-bold text-gray-900">
                    Order Information
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-semibold text-gray-900">
                        {selectedOrder.orderId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Created At
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {new Date(
                          selectedOrder.createdAt
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Order Status
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusBadge(
                          selectedOrder.orderStatus
                        )}`}
                      >
                        {selectedOrder.orderStatus}
                      </span>
                    </div>

                  </div>

                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    disabled={updatingId === selectedOrder._id}
                    onClick={() =>
                      updateStatus(selectedOrder._id, "Confirmed")
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Confirm Order
                  </button>

                  <button
                    disabled={updatingId === selectedOrder._id}
                    onClick={() =>
                      updateStatus(selectedOrder._id, "Shipped")
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Truck className="h-5 w-5" />
                    Ship Order
                  </button>

                  <button
                    disabled={updatingId === selectedOrder._id}
                    onClick={() =>
                      updateStatus(selectedOrder._id, "Delivered")
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    <PackageCheck className="h-5 w-5" />
                    Deliver Order
                  </button>

                  <button
                    disabled={updatingId === selectedOrder._id}
                    onClick={() =>
                      updateStatus(selectedOrder._id, "Cancelled")
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-5 w-5" />
                    Cancel Order
                  </button>

                  <div className="ml-auto">

                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      Close
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );
}