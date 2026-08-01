import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");

    // Counts
    const totalProducts = await productsCollection.countDocuments();
    const totalOrders = await ordersCollection.countDocuments();

    const pendingOrders = await ordersCollection.countDocuments({
      status: "Pending",
    });

    const shippedOrders = await ordersCollection.countDocuments({
      status: "Shipped",
    });

    const deliveredOrders = await ordersCollection.countDocuments({
      status: "Delivered",
    });

    // Revenue
    const revenueData = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$total",
            },
          },
        },
      ])
      .toArray();

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Recent Orders
    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Recent Products
    const recentProducts = await productsCollection
      .find({})
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      success: true,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
      recentProducts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}