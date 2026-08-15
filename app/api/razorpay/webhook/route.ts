import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    // IMPORTANT:
    // Razorpay webhook signature must be checked against
    // the ORIGINAL raw request body.
    const rawBody = await req.text();

    const signature =
      req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Razorpay signature",
        },
        { status: 400 }
      );
    }

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "RAZORPAY_WEBHOOK_SECRET is missing"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Webhook secret is not configured",
        },
        { status: 500 }
      );
    }

    // Verify Razorpay webhook signature
    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          webhookSecret
        )
        .update(rawBody)
        .digest("hex");

    if (
      expectedSignature.length !==
      signature.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature",
        },
        { status: 400 }
      );
    }

    const isValid =
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature",
        },
        { status: 400 }
      );
    }

    // Parse only AFTER signature verification
    const event = JSON.parse(rawBody);

    console.log(
      "RAZORPAY WEBHOOK EVENT:",
      event.event
    );

    // We only need QR payment success
    if (event.event !== "qr_code.credited") {
      return NextResponse.json({
        success: true,
        message: "Event received",
      });
    }

    const payment =
      event?.payload?.payment?.entity;

    const qrCode =
      event?.payload?.qr_code?.entity;

    if (!payment || !qrCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid QR payment payload",
        },
        { status: 400 }
      );
    }

    // Payment must be captured
    if (payment.status !== "captured") {
      return NextResponse.json({
        success: true,
        message: "Payment is not captured yet",
      });
    }

    const paymentId = payment.id;

    const orderId =
      qrCode?.notes?.orderId ||
      payment?.notes?.orderId;

    if (!orderId) {
      console.error(
        "No orderId found in QR/payment notes"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Order ID not found",
        },
        { status: 400 }
      );
    }

    console.log(
      "QR PAYMENT RECEIVED:",
      {
        orderId,
        paymentId,
        amount: payment.amount,
      }
    );

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    // Find the website order
    const existingOrder =
      await db
        .collection("orders")
        .findOne({
          orderId,
        });

    if (!existingOrder) {
      console.error(
        "Order not found:",
        orderId
      );

      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    // Security check:
    // Razorpay amount is in paise.
    const razorpayAmount =
      Number(payment.amount);

    const websiteAmount =
      Math.round(
        Number(existingOrder.total) * 100
      );

    if (
      razorpayAmount !==
      websiteAmount
    ) {
      console.error(
        "Amount mismatch:",
        {
          orderId,
          razorpayAmount,
          websiteAmount,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: "Payment amount mismatch",
        },
        { status: 400 }
      );
    }

    // Idempotent update:
    // If Razorpay sends the same webhook again,
    // it will not create another order.
    await db
      .collection("orders")
      .updateOne(
        {
          orderId,
        },
        {
          $set: {
            paymentId,
            paymentMethod:
              "UPI / Razorpay QR",
            paymentStatus: "Paid",
            orderStatus: "Confirmed",
            updatedAt: new Date(),
          },
        }
      );

    console.log(
      "PAYMENT MARKED PAID:",
      orderId
    );

    return NextResponse.json({
      success: true,
      message:
        "Payment received and order updated",
      orderId,
      paymentId,
    });
  } catch (error) {
    console.error(
      "RAZORPAY WEBHOOK ERROR:",
      error
    );

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