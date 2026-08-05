import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      productId,
      name,
      rating,
      comment,
    } = body;

    if (
      !productId ||
      !name ||
      !rating ||
      !comment
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const review = {
      _id: new ObjectId(),
      name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    await db.collection("products").updateOne(
      {
        _id: new ObjectId(productId),
      },
      {
        $push: {
          reviews: review,
        } as any,
      }
    );

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit review",
      },
      {
        status: 500,
      }
    );
  }
}
