import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

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