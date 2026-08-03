import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("kashmir-shawls");
    const { searchParams } = new URL(request.url);
const range = searchParams.get("range") || "all";

const now = new Date();
let startDate = new Date(0);

switch (range) {
  case "today":
    startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    break;

  case "week":
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
    break;

  case "month":
    startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    break;

  case "year":
    startDate = new Date(
      now.getFullYear(),
      0,
      1
    );
    break;
}

const dateFilter =
  range === "all"
    ? {}
    : {
        createdAt: {
          $gte: startDate,
        },
      };

    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");

    // Counts
    const totalProducts = await productsCollection.countDocuments();
    const totalOrders = await ordersCollection.countDocuments(
  dateFilter
);

   const pendingOrders = await ordersCollection.countDocuments({
  ...dateFilter,
  status: "Pending",
});

    const shippedOrders = await ordersCollection.countDocuments({
  ...dateFilter,
  status: "Shipped",
});

    const deliveredOrders = await ordersCollection.countDocuments({
  ...dateFilter,
  status: "Delivered",
});
// Monthly Revenue
const monthlyRevenue = await ordersCollection
  .aggregate([
    {
  $match: dateFilter,
},
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: {
          $sum: "$total",
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ])
  .toArray();
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
      .find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
// Top Selling Products
const topSellingProducts = await ordersCollection
  .aggregate([
    {
      $unwind: "$cart",
    },
    {
      $group: {
        _id: "$cart.title",
        totalSold: {
          $sum: "$cart.quantity",
        },
        image: {
          $first: "$cart.image",
        },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
    {
      $limit: 5,
    },
  ])
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
      monthlyRevenue,
      topSellingProducts,
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