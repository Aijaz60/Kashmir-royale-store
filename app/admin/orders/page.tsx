async function getOrders() {
  const res = await fetch("http://localhost:3000/api/orders", {
    cache: "no-store",
  });

  return res.json();
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Admin Orders
        </h1>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-yellow-500 text-black">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment ID</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td className="p-4" colSpan={5}>
                    No Orders Yet
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id}>
                    <td className="p-4 border-b">
                      {order.customer?.name}
                    </td>

                    <td className="p-4 border-b">
                      {order.customer?.phone}
                    </td>

                    <td className="p-4 border-b">
                      ₹{order.total}
                    </td>

                    <td className="p-4 border-b">
                      {order.paymentId}
                    </td>

                    <td className="p-4 border-b text-green-600 font-semibold">
                      Paid
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