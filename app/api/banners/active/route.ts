import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import type { Document } from "mongodb";

interface Banner extends Document {
  active: boolean;
  createdAt?: Date;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const banners = await db
      .collection<Banner>("banners")
      .find({
        active: true,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        banners: [],
        error: "Failed to load active banners",
      },
      {
        status: 500,
      }
    );
  }
}