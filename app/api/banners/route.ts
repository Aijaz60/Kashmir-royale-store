import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

const COLLECTION = "banners";
const DATABASE = "kashmir-shawls";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE);

    const banners = await db
      .collection(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("GET /api/banners Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load banners",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DATABASE);

    const result = await db.collection(COLLECTION).insertOne({
      title: body.title,
      subtitle: body.subtitle,
      buttonText: body.buttonText,
      buttonLink: body.buttonLink,
      image: body.image,
      active: body.active ?? true,
      createdAt: new Date(),
    });

    console.log("✅ Banner Saved:", result.insertedId);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Banner created successfully",
    });
  } catch (error) {
    console.error("POST /api/banners Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create banner",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Banner ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;
    const db = client.db(DATABASE);

    const result = await db.collection(COLLECTION).deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/banners Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete banner",
      },
      {
        status: 500,
      }
    );
  }
}