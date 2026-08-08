import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyAuthToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const secret = process.env.ADMIN_AUTH_SECRET;

  if (!secret) {
    console.error("ADMIN_AUTH_SECRET is not configured");
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const [timestamp, signature] = parts;

  const issuedAt = Number(timestamp);

  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  const maxAge = 24 * 60 * 60 * 1000;

  if (Date.now() - issuedAt > maxAge) {
    return false;
  }

  try {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"]
    );

    const signatureBytes = new Uint8Array(
      signature
        .match(/.{1,2}/g)
        ?.map((byte) => parseInt(byte, 16)) ?? []
    );

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(timestamp)
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin-auth")?.value;
  const { pathname } = request.nextUrl;

  const authenticated = await verifyAuthToken(token);

  // Admin login page
  if (pathname === "/admin/login") {
    if (authenticated) {
      return NextResponse.redirect(
        new URL("/admin/orders", request.url)
      );
    }

    return NextResponse.next();
  }

  // Protect Admin Pages
  if (pathname.startsWith("/admin")) {
    if (!authenticated) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  // Protect Admin APIs
  const protectedApi =
    pathname.startsWith("/api/orders") ||
    pathname.startsWith("/api/update-order-status") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/banners") ||
    pathname.startsWith("/api/add-product") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/update-product") ||
    pathname.startsWith("/api/delete-product") ||
    pathname.startsWith("/api/restock-product");

  if (protectedApi && !authenticated) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/orders/:path*",
    "/api/update-order-status/:path*",
    "/api/settings/:path*",
    "/api/banners/:path*",
    "/api/add-product",
    "/api/upload",
    "/api/update-product/:path*",
    "/api/delete-product/:path*",
    "/api/restock-product/:path*",
  ],
};