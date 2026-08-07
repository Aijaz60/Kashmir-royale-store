import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
  return NextResponse.json(
    {
      success: false,
      message: "Email and password are required",
    },
    {
      status: 400,
    }
  );
}

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({
      success: true,
    });

   response.cookies.set("admin-auth", "logged-in", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day
});
    return response;
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid Email or Password",
    },
    {
      status: 401,
    }
  );
}