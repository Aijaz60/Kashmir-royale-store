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
    const { status } = await req.json();

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const result = await db.collection("orders").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
        },
      }
    );

    const updatedOrder = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    });

    if (updatedOrder?.customer?.email) {
      if (status === "Shipped") {
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
          console.error("Shipped email failed:", emailError);
        }
      }

      if (status === "Delivered") {
        try {
          await sendOrderEmail(
            updatedOrder.customer.email,
            "✅ Your Kashmir Royale Order Has Been Delivered",
            emailTemplate({
              title: "Order Delivered ❤️",
              customerName: updatedOrder.customer.name,
              message:
                "Your order has been delivered successfully. We hope you love your purchase. Thank you for choosing Kashmir Royale.",
              status: "Delivered",
              total: updatedOrder.total,
            })
          );
        } catch (emailError) {
          console.error("Delivered email failed:", emailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order status",
      },
      {
        status: 500,
      }
    );
  }
}