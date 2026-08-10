import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const { orderId, phone } = await req.json();

    if (!orderId || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID and phone number are required.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const order = await db.collection("orders").findOne(
      {
        orderId: orderId.trim(),
        "customer.phone": phone.trim(),
      },
      {
        projection: {
          _id: 0,
          orderId: 1,
          paymentStatus: 1,
          orderStatus: 1,
          total: 1,
          createdAt: 1,
          "customer.name": 1,
          cart: 1,
        },
      }
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found. Please check your Order ID and phone number.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("TRACK ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to track order.",
      },
      { status: 500 }
    );
  }
}