import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin-auth")?.value;
  const { pathname } = request.nextUrl;

  // Allow Admin Login Page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }
  // Redirect logged-in admin away from login page
if (pathname === "/admin/login" && token === "logged-in") {
  return NextResponse.redirect(
    new URL("/admin/orders", request.url)
  );
}

  // Protect Admin Pages
  if (pathname.startsWith("/admin")) {
    if (token !== "logged-in") {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  // Protect Admin APIs
  if (
    pathname.startsWith("/api/orders") ||
    pathname.startsWith("/api/update-order-status") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/banners") ||
    pathname.startsWith("/api/products/add") ||
    pathname.startsWith("/api/products/edit") ||
    pathname.startsWith("/api/products/delete") ||
    pathname.startsWith("/api/upload") ||
pathname.startsWith("/api/update-product") ||
pathname.startsWith("/api/delete-product") ||
pathname.startsWith("/api/restock-product")
  ) {
    if (token !== "logged-in") {
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/orders",
    "/api/update-order-status/:path*",
    "/api/settings/:path*",
    "/api/banners/:path*",
    "/api/products/add/:path*",
    "/api/products/edit/:path*",
    "/api/products/delete/:path*",
    "/api/upload/:path*",
    "/api/update-product/:path*",
"/api/delete-product/:path*",
"/api/restock-product/:path*",
  ],
};