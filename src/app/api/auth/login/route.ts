import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";

/**
 * Next.js App Router API Route - Login endpoint
 * POST /api/auth/login
 * Modern Next.js 13+ App Router pattern with route.ts
 */
export async function POST(request: NextRequest) {
  try {
    // Parse FormData from the request (client sends FormData, not JSON)
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const devicetype = (formData.get("devicetype") as string) || "web";

    if (!username || !password) {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "validation Error",
            Errors: "Username and password are required",
          },
        },
        { status: 400 }
      );
    }

    // Use URLSearchParams for form data (Node.js compatible)
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("username", username);
    urlSearchParams.append("password", password);
    urlSearchParams.append("devicetype", devicetype);

    // Call external backend API
    const response = await fetch(`${appConfig.webServerURL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlSearchParams.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: data.message || "Login failed",
          },
        },
        { status: response.status }
      );
    }

    // Return the response as-is (should have respondStatus: "SUCCESS")
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Server.Error",
          Errors: error.message || "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

