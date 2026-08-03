import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { quantity } = await req.json();

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const result = await db.collection("products").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $inc: {
          stock: Number(quantity),
        },
      }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to restock product",
      },
      {
        status: 500,
      }
    );
  }
}