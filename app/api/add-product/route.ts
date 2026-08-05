import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Product title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.images || body.images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one product image is required",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const result = await db.collection("products").insertOne({
      title: body.title,
      description: body.description || "",
      category: body.category || "Shawls",

      price: Number(body.price || 0),
      oldPrice: Number(body.oldPrice || 0),

      discount: body.discount || "",
      rating: Number(body.rating || 5),

      stock: Number(body.stock || 0),
      sold: 0,

      images: body.images || [],

      featured: body.featured ?? false,
      newArrival: body.newArrival ?? false,
      bestSeller: body.bestSeller ?? false,
      active: body.active ?? true,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add product",
      },
      {
        status: 500,
      }
    );
  }
}
