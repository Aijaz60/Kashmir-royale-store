import { NextResponse } from "next/server";
import razorpay from "../../lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = Number(body.amount);
    const orderId = String(body.orderId || "");

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
        },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 }
      );
    }

    const qr = await razorpay.qrCode.create({
      type: "upi_qr",
      name: `Kashmir Royale ${orderId}`,
      usage: "single_use",
      fixed_amount: true,
      payment_amount: Math.round(amount * 100),
      description: `Payment for ${orderId}`,
      notes: {
        orderId,
      },
    });

    return NextResponse.json({
      success: true,
      qrId: qr.id,
      imageUrl: qr.image_url,
      paymentAmount: qr.payment_amount,
      status: qr.status,
    });
  } catch (error) {
    console.error("CREATE QR ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}