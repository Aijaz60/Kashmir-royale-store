import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const result = await db.collection("products").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
  title: body.title,
  description: body.description,
  price: Number(body.price),
  oldPrice: Number(body.oldPrice),
  discount: body.discount,
  rating: body.rating,
  category: body.category,
  image: body.image,
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
        error: "Failed to update product",
      },
      {
        status: 500,
      }
    );
  }
}