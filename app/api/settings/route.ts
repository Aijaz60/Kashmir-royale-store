import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";


const COLLECTION = "settings";
const DOCUMENT_ID = "website-settings";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

    const settings = await db.collection<any>(COLLECTION).findOne({
      _id: DOCUMENT_ID,
    });
return NextResponse.json({
  success: true,
  settings: settings ?? {},
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load settings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: Record<string, unknown> = await req.json();

    const client = await clientPromise;
    const db = client.db("kashmir-shawls");

await db.collection<any>(COLLECTION).updateOne(
  {
   _id: DOCUMENT_ID,
  },
  {
    $set: {
      ...(body as Record<string, unknown>),
      updatedAt: new Date(),
    },
  },
  {
    upsert: true,
  }
);

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save settings",
      },
      {
        status: 500,
      }
    );
  }
}