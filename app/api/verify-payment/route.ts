import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();
    if (
  !razorpay_order_id ||
  !razorpay_payment_id ||
  !razorpay_signature
) {
  return NextResponse.json(
    {
      success: false,
      message: "Missing payment details",
    },
    {
      status: 400,
    }
  );
}

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (
  crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(razorpay_signature)
  )
) {
      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid Signature",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("Verification Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification Failed",
      },
      {
        status: 500,
      }
    );
  }
}