"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/update-order-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        loadOrders();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }
function exportToExcel() {
  const data = filteredOrders.map((order: any) => ({
    Customer: order.customer?.name,
    Email: order.customer?.email,
    Phone: order.customer?.phone,
    Amount: order.total,
    Status: order.status,
    PaymentID: order.paymentId,
    OrderID: order.orderId,
    Date: order.createdAt
      ? new Date(order.createdAt).toLocaleString()
      : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Orders"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

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
  const filteredOrders = orders.filter((order: any) => {
  const matchesSearch =
    order.customer?.name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    order.paymentId
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    order.status === statusFilter;

  return matchesSearch && matchesStatus;
});
    return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Admin Orders
        </h1>
        <div className="flex justify-end mb-6">
  <button
    onClick={exportToExcel}
    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg transition"
  >
    📊 Export Orders to Excel
  </button>
</div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="mb-6 text-gray-600 font-medium">
  Showing <span className="font-bold">{filteredOrders.length}</span> of{" "}
  <span className="font-bold">{orders.length}</span> orders
</div>

  <input
    type="text"
    placeholder="Search by customer or payment ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 border rounded-lg px-4 py-3"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border rounded-lg px-4 py-3"
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
  </select>
</div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-yellow-500 text-black">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment ID</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    No Orders Yet
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {order.customer?.name}
                    </td>

                    <td className="p-4">
                      {order.customer?.phone}
                    </td>

                    <td className="p-4 font-semibold">
                      ₹{order.total}
                    </td>

                    <td className="p-4">
                      {order.paymentId}
                    </td>

                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Confirmed")
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(order._id, "Shipped")
                          }
                          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                        >
                          Ship
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(order._id, "Delivered")
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Deliver
                        </button>
                        <Link
  href={`/admin/orders/${order._id}`}
  prefetch={false}
>
  <button className="bg-black text-white px-3 py-1 rounded">
    View
  </button>
</Link>
                      </div>
                    </td>

                    <td className="p-4">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
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
