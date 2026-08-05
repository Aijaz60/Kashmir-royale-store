"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
}
interface Order {
  _id: string;

  customer: Customer;

  total: number;

  paymentId?: string;
  orderId?: string;

  paymentMethod?: string;
  paymentStatus?: string;

  orderStatus: string;

  createdAt: string;
}
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {
    try {
      const res = await fetch(
        `/api/update-order-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  orderStatus: status,
}),
        }
      );

      const data = await res.json();

      if (data.success) {
        loadOrders();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }
const totalOrders = orders.length;

const pendingOrders = orders.filter(
  (order) => order.orderStatus === "Pending"
).length;

const shippedOrders = orders.filter(
  (order) => order.orderStatus === "Shipped"
).length;

const deliveredOrders = orders.filter(
  (order) => order.orderStatus === "Delivered"
).length;
const cancelledOrders = orders.filter(
  (order) => order.orderStatus === "Cancelled"
).length;

const totalRevenue = orders
  .filter(
    (order) =>
      order.paymentStatus === "Paid" &&
      order.orderStatus !== "Cancelled"
  )
  .reduce((sum, order) => sum + order.total, 0);
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        order.customer?.name
          ?.toLowerCase()
          .includes(keyword) ||
        order.customer?.email
          ?.toLowerCase()
          .includes(keyword) ||
        order.customer?.phone
          ?.toLowerCase()
          .includes(keyword) ||
        order.paymentId
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  function exportToExcel() {
    const excelData = filteredOrders.map(
      (order) => ({
        Customer: order.customer?.name,
        Email: order.customer?.email,
        Phone: order.customer?.phone,
        Amount: order.total,
        Status: order.orderStatus,
        PaymentID: order.paymentId,
        OrderID: order.orderId,
        Date: order.createdAt
          ? new Date(
              order.createdAt
            ).toLocaleString()
          : "",
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Orders"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const file = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(file, "Orders.xlsx");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Loading Orders...
        </h2>
      </main>
    );
  }
    return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8 pb-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">
            Admin Orders
          </h1>

          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            📊 Export Orders
          </button>
        </div>
<div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-2xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Total Orders
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {totalOrders}
    </h2>
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Pending
    </p>

    <h2 className="mt-2 text-3xl font-bold text-yellow-600">
      {pendingOrders}
    </h2>
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Shipped
    </p>

    <h2 className="mt-2 text-3xl font-bold text-purple-600">
      {shippedOrders}
    </h2>
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <p className="text-sm text-gray-500">
      Delivered
    </p>

    <h2 className="mt-2 text-3xl font-bold text-green-600">
      {deliveredOrders}
    </h2>
  </div>
  <div className="rounded-2xl bg-white p-6 shadow">
  <p className="text-sm text-gray-500">
    Revenue
  </p>

  <h2 className="mt-2 text-3xl font-bold text-emerald-600">
    ₹{totalRevenue.toLocaleString()}
  </h2>
</div>
<div className="rounded-2xl bg-white p-6 shadow">
  <p className="text-sm text-gray-500">
    Cancelled
  </p>

  <h2 className="mt-2 text-3xl font-bold text-red-600">
    {cancelledOrders}
  </h2>
</div>

</div>
        <div className="bg-white rounded-xl shadow p-5 mb-8">

          <div className="mb-5 text-gray-700">
            Showing{" "}
            <span className="font-bold">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-bold">
              {orders.length}
            </span>{" "}
            orders
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search customer, phone, email or payment ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg px-4 py-3 w-full"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border rounded-lg px-4 py-3 w-full"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>
              <option value="Cancelled">
  Cancelled
</option>
            </select>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-yellow-500 text-black">

              <tr>

                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>
                <th className="p-4 text-left">
  Payment ID
</th>

               <th className="p-4 text-left">
  Payment Method
</th>
<th className="p-4 text-left">
  Payment Status
</th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan={9}
                    className="text-center p-8"
                  >
                    No Orders Found
                  </td>

                </tr>

              ) : (

                filteredOrders.map((order) => (
                                    <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="font-semibold">
                        {order.customer?.name || "-"}
                      </div>

                      <div className="text-sm text-gray-500">
                        {order.customer?.email || "-"}
                      </div>
                    </td>

                    <td className="p-4">
                      {order.customer?.phone || "-"}
                    </td>

                    <td className="p-4 font-semibold text-green-700">
                      ₹{order.total}
                    </td>

                    <td className="p-4 break-all">
                      {order.paymentId}
                    </td>
<td className="p-4">
  {order.paymentMethod || "Razorpay"}
</td>

<td className="p-4">
  <span
    className={`rounded-full px-3 py-1 text-sm font-semibold ${
      order.paymentStatus === "Paid"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {order.paymentStatus || "Paid"}
  </span>
</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                       ${
  order.orderStatus === "Pending"
    ? "bg-yellow-100 text-yellow-700"
    : order.orderStatus === "Confirmed"
    ? "bg-blue-100 text-blue-700"
    : order.orderStatus === "Shipped"
    ? "bg-purple-100 text-purple-700"
    : order.orderStatus === "Cancelled"
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700"

                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">

                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Confirmed"
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Shipped"
                            )
                          }
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                        >
                          Ship
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Delivered"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Deliver
                        </button>
                        <button
  onClick={() =>
    updateStatus(
      order._id,
      "Cancelled"
    )
  }
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
>
  Cancel
</button>

                        <Link
                          href={`/admin/orders/${order._id}`}
                          prefetch={false}
                        >
                          <button className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded">
                            View
                          </button>
                        </Link>

                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
              </div>
    </main>
  );
}