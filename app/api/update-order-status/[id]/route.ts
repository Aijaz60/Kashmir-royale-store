import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { sendOrderEmail } from "../../../lib/email";
import { emailTemplate } from "../../../lib/emailTemplate";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      orderStatus,
      paymentStatus,
      paymentMethod,
      paymentId,
    } = body;

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    // -----------------------------
    // ORDER STATUS UPDATE
    // -----------------------------
    if (orderStatus) {
      updateFields.orderStatus = orderStatus;
    }

    // -----------------------------
    // PAYMENT STATUS UPDATE
    // -----------------------------
    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      updateFields.paymentMethod = paymentMethod;
    }

    if (paymentId) {
      updateFields.paymentId = paymentId;
    }

    // Nothing to update
    if (Object.keys(updateFields).length === 1) {
      return NextResponse.json(
        {
          success: false,
          error: "No update data provided",
        },
        { status: 400 }
      );
    }

    const result = await db.collection("orders").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updateFields,
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    const updatedOrder = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    });

    // -----------------------------
    // CUSTOMER EMAILS
    // -----------------------------
    if (updatedOrder?.customer?.email && orderStatus) {
      if (orderStatus === "Confirmed") {
        try {
          await sendOrderEmail(
            updatedOrder.customer.email,
            "🎉 Your Kashmir Royale Order Has Been Confirmed",
            emailTemplate({
              title: "Order Confirmed 🎉",
              customerName: updatedOrder.customer.name,
              message:
                "Your order has been confirmed by our team and is now being prepared for dispatch.",
              status: "Confirmed",
              total: updatedOrder.total,
            })
          );
        } catch (emailError) {
          console.error(
            "Confirmed email failed:",
            emailError
          );
        }
      }

      if (orderStatus === "Shipped") {
        try {
          await sendOrderEmail(
            updatedOrder.customer.email,
            "📦 Your Kashmir Royale Order Has Been Shipped",
            emailTemplate({
              title: "Your Order Has Been Shipped 🚚",
              customerName: updatedOrder.customer.name,
              message:
                "Great news! Your order has been shipped and is on its way. We'll notify you again once it has been delivered.",
              status: "Shipped",
              total: updatedOrder.total,
            })
          );
        } catch (emailError) {
          console.error(
            "Shipped email failed:",
            emailError
          );
        }
      }

      if (orderStatus === "Delivered") {
        try {
          await sendOrderEmail(
            updatedOrder.customer.email,
            "✅ Your Kashmir Royale Order Has Been Delivered",
            emailTemplate({
              title: "Order Delivered ✅",
              customerName: updatedOrder.customer.name,
              message:
                "Your order has been delivered successfully. We hope you love your purchase. Thank you for choosing Kashmir Royale.",
              status: "Delivered",
              total: updatedOrder.total,
            })
          );
        } catch (emailError) {
          console.error(
            "Delivered email failed:",
            emailError
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "UPDATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update order",
      },
      {
        status: 500,
      }
    );
  }
}