import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

import {
  sendOrderEmail,
} from "../../lib/email";

import {
  emailTemplate,
  adminOrderTemplate,
} from "../../lib/emailTemplate";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    console.log("=================================");
    console.log("ORDER RECEIVED");
    console.log(order);
    console.log("=================================");

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const result = await db.collection("orders").insertOne({
      ...order,

      paymentMethod:
        order.paymentMethod || "Razorpay",

      paymentStatus:
        order.paymentStatus || "Paid",

      orderStatus:
        order.orderStatus || "Pending",

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update Inventory
    for (const item of order.cart) {
      await db.collection("products").updateOne(
        {
          _id: new ObjectId(item.id),
        },
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        }
      );
    }

    console.log("✅ Order Saved:", result.insertedId);

    // ------------------------
    // CUSTOMER EMAIL
    // ------------------------
        // Send Customer Email (Never fail order if email fails)
    if (order.customer?.email) {
      try {
        console.log(
          "📧 Sending customer email:",
          order.customer.email
        );

        await sendOrderEmail(
          order.customer.email,
          "🎉 Your Kashmir Royale Order is Confirmed",
          emailTemplate({
            title: "Order Confirmed 🎉",
            customerName: order.customer.name,
            message:
              "Thank you for your order. We have received it successfully and our team has started processing it.",
            status: order.orderStatus || "Pending",
            total: order.total,
          })
        );

        console.log("✅ Customer email sent");
      } catch (emailError) {
        console.error(
          "❌ Customer email failed:",
          emailError
        );
      }
    }

    // Send Admin Email (Never fail order if email fails)
    if (process.env.ADMIN_EMAIL) {
      try {
        console.log(
          "📧 Sending admin email:",
          process.env.ADMIN_EMAIL
        );

        await sendOrderEmail(
          process.env.ADMIN_EMAIL,
          "🛒 New Order Received - Kashmir Royale",
          adminOrderTemplate({
            customerName: order.customer.name,
            email: order.customer.email,
            phone: order.customer.phone,
            total: order.total,
            paymentId: order.paymentId,
            orderId: order.orderId,
          })
        );

        console.log("✅ Admin email sent");
      } catch (emailError) {
        console.error(
          "❌ Admin email failed:",
          emailError
        );
      }
    }

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message:
        "Order saved successfully",
    });
  } catch (error) {
    console.error(
      "SAVE ORDER ERROR:",
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
      {
        status: 500,
      }
    );
  }
}