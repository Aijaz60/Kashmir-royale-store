import Image from "next/image";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import DownloadInvoice from "../../../components/DownloadInvoice";

async function getOrder(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    });

    return order;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrder(id);

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Order Not Found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Order Details
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              Customer Information
            </h2>

            <p><strong>Name:</strong> {order.customer?.name}</p>
            <p><strong>Email:</strong> {order.customer?.email}</p>
            <p><strong>Phone:</strong> {order.customer?.phone}</p>

            <div className="mt-4">
              <strong>Address:</strong>
              <p>{order.customer?.address}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              Payment Information
            </h2>

            <p><strong>Payment ID:</strong> {order.paymentId}</p>

            <p className="mt-2">
              <strong>Order ID:</strong> {order.orderId}
            </p>

            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                {order.status}
              </span>
            </p>

            <p className="mt-2">
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-6">
              ₹{order.total}
            </h3>

            <div className="mt-6">
              <DownloadInvoice order={order as any} />
            </div>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">
            Ordered Products
          </h2>

          <div className="space-y-6">

            {order.cart?.map((item: any) => (
              <div
                key={item._id || item.title}
                className="flex items-center gap-6 border-b pb-5"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={90}
                  height={90}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {item.title}
                  </h3>

                  <p>Quantity: {item.quantity}</p>

                  <p>Price: ₹{item.price}</p>
                </div>

                <div className="text-xl font-bold">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </main>
  );
}