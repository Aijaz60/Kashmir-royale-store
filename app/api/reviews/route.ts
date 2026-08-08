import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

interface Review {
  _id: ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ProductReviewUpdate {
  reviews: Review[];
}

interface ReviewRequest {
  productId?: string;
  name?: string;
  rating?: number | string;
  comment?: string;
}

export async function POST(req: Request) {
  try {
    const body =
      (await req.json()) as ReviewRequest;

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

    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    const client =
      await clientPromise;

    const db =
      client.db("kashmir-shawls");

    const review: Review = {
      _id: new ObjectId(),
      name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    await db
      .collection<ProductReviewUpdate>(
        "products"
      )
      .updateOne(
        {
          _id: new ObjectId(productId),
        },
        {
          $push: {
            reviews: review,
          },
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