import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Read environment variables at runtime
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log("[CLOUDINARY UPLOAD CONFIG]", {
      cloudNameExists: !!cloudName,
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiSecretExists: !!apiSecret,
      apiSecretLength: apiSecret?.length || 0,
    });

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary environment variables are missing.",
        },
        {
          status: 500,
        }
      );
    }

    // Configure Cloudinary at request runtime
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG, JPEG, PNG and WEBP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum image size is 5MB.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "kashmir-royale",
            },
            (
              error: UploadApiErrorResponse | undefined,
              uploadResult: UploadApiResponse | undefined
            ) => {
              if (error) {
                reject(error);
                return;
              }

              if (!uploadResult) {
                reject(
                  new Error("Cloudinary upload returned no result.")
                );
                return;
              }

              resolve(uploadResult);
            }
          )
          .end(buffer);
      }
    );

    console.log("[CLOUDINARY UPLOAD SUCCESS]", {
      publicId: result.public_id,
      urlExists: !!result.secure_url,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("[CLOUDINARY UPLOAD ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}