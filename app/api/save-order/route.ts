import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { sendOrderEmail } from "../../lib/email";
import { emailTemplate } from "../../lib/emailTemplate";
import { generateInvoice } from "../../lib/invoice";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    console.log("ORDER RECEIVED:", order);

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const result = await db.collection("orders").insertOne({
      ...order,
      status: "Pending",
      createdAt: new Date(),
    });
    if (order.customer?.email) {
      const invoicePdf = await generateInvoice(order);

const attachments = [
  {
    filename: `Invoice-${order.orderId ?? "invoice"}.pdf`,
    content: invoicePdf,
  },
];
  await sendOrderEmail(
    order.customer.email,
    "🎉 Your Kashmir Royale Order is Confirmed",
    `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Thank you for shopping with Kashmir Royale ❤️</h2>

        <p>Hello <b>${order.customer.name}</b>,</p>

        <p>Your order has been received successfully.</p>

        <hr/>

        <p><b>Amount:</b> ₹${order.total}</p>

        <p><b>Status:</b> Pending</p>

        <p>We'll notify you when your order is shipped.</p>

        <br/>

        <p>Thank you,<br/>Kashmir Royale</p>
      </div>
    `
  );
}
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
  attachments
);

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
