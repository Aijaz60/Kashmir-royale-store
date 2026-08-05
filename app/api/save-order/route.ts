import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import {
  sendOrderEmail,
  type EmailAttachment,
} from "../../lib/email";
import {
  emailTemplate,
  adminOrderTemplate,
} from "../../lib/emailTemplate";


export async function POST(req: Request) {
  try {
    const order = await req.json();

    console.log("ORDER RECEIVED:", order);

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

   const result = await db.collection("orders").insertOne({
  ...order,

  paymentMethod: order.paymentMethod || "Razorpay",
  paymentStatus: order.paymentStatus || "Paid",
  orderStatus: order.orderStatus || "Pending",

  createdAt: new Date(),
  updatedAt: new Date(),
});
if (order.customer?.email) {
 

  await sendOrderEmail(
    order.customer.email,
    "🎉 Your Kashmir Royale Order is Confirmed",
    emailTemplate({
      title: "Order Confirmed 🎉",
      customerName: order.customer.name,
      message:
        "Thank you for your order. We have received it successfully and our team has started processing it.",
      status: "Pending",
      total: order.total,
    }),
  
  );
}

if (process.env.ADMIN_EMAIL) {
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
}

    // Update inventory
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

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("SAVE ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
