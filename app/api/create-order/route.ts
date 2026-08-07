import { NextResponse } from "next/server";
import razorpay from "../../lib/razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
  return NextResponse.json(
    {
      error: "Invalid amount",
    },
    {
      status: 400,
    }
  );
}

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