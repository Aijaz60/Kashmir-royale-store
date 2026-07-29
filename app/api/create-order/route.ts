import { NextResponse } from "next/server";
import razorpay from "../../lib/razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Create Order Error:", error);

    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}