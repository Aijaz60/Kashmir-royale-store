import Image from "next/image";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

interface CartItem {
  _id?: string;
  title?: string;
  image?: string;
  quantity: number;
  price: number;
}

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface Order {
  _id: ObjectId;
  customer?: Customer;
  paymentId?: string;
  paymentMethod?: string;
  orderStatus?: string;
  createdAt?: string | Date;
  cart?: CartItem[];
  total?: number;
}

async function getOrder(
  id: string
): Promise<Order | null> {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const order =
      await db
        .collection<Order>("orders")
        .findOne({
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

  console.log("ID:", id);
  console.log("ORDER:", order);

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-100 px-8 pt-32">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow">
          <h1 className="text-3xl font-bold">
            Order Not Found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-8 pt-32">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-4xl font-bold">
          Order Details
        </h1>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Customer Information */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">
              Customer Information
            </h2>

            <p>
              <strong>Name:</strong>{" "}
              {order.customer?.name || "-"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.customer?.email || "-"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {order.customer?.phone || "-"}
            </p>

            <div className="mt-4">
              <strong>Address:</strong>
              <p>
                {order.customer?.address || "-"}
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">
              Payment Information
            </h2>

            <p>
              <strong>Payment ID:</strong>{" "}
              {order.paymentId || "-"}
            </p>

            <p className="mt-2">
              <strong>Payment Method:</strong>{" "}
              {order.paymentMethod || "Razorpay"}
            </p>

            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  order.orderStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.orderStatus === "Confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : order.orderStatus === "Shipped"
                        ? "bg-purple-100 text-purple-700"
                        : order.orderStatus ===
                            "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                }`}
              >
                {order.orderStatus || "-"}
              </span>
            </p>

            <p className="mt-2">
              <strong>Date:</strong>{" "}
              {order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleString()
                : "-"}
            </p>

            <div className="mt-6 rounded-xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">
                Order Total
              </p>

              <p className="mt-1 text-3xl font-bold text-green-700">
                ₹
                {Number(
                  order.total || 0
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

        </div>

        {/* Ordered Products */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow">

          <h2 className="mb-6 text-2xl font-bold">
            Ordered Products
          </h2>

          <div className="space-y-6">

            {order.cart?.map((item, index) => (
              <div
                key={
                  item._id ||
                  `${item.title || "product"}-${index}`
                }
                className="flex items-center gap-6 border-b pb-5"
              >
                <Image
                  src={
                    item.image ||
                    "/images/placeholder.jpg"
                  }
                  alt={
                    item.title || "Product"
                  }
                  width={90}
                  height={90}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold">
                    {item.title || "Product"}
                  </h3>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                  <p>
                    Price: ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="text-xl font-bold">
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toLocaleString("en-IN")}
                </div>
              </div>
            ))}

            {(!order.cart ||
              order.cart.length === 0) && (
              <p className="py-8 text-center text-gray-500">
                No products found in this order.
              </p>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}