import { nextEnv } from "@/nextEnv";
import { NextRequest, NextResponse } from "next/server";

// Store the password in an environment variable in a real app
// For now, we'll hardcode it here, but this is server-side code that won't be exposed to the client
const ADMIN_PASSWORD = nextEnv.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { password } = (await request.json()) as { password: string };
    console.log("password", password);
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Create a response with authentication cookie
      const response = NextResponse.json({ success: true }, { status: 200 });

      // Set a cookie that expires in 1 year (or as long as you want)
      // This is more secure than setting it client-side
      response.cookies.set({
        name: "auth-token",
        value: "authenticated",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
