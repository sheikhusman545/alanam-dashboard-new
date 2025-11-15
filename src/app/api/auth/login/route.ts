import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";

// Force dynamic rendering for Vercel serverless functions
export const dynamic = 'force-dynamic';

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
    let response: Response;
    try {
      response = await fetch(`${appConfig.webServerURL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlSearchParams.toString(),
      });
    } catch (fetchError: any) {
      console.error("Network error calling external API:", fetchError);
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: `Failed to connect to server: ${fetchError.message || "Network error"}`,
          },
        },
        { status: 503 }
      );
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    let data: any;
    
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonError: any) {
        console.error("Failed to parse JSON response:", jsonError);
        const text = await response.text();
        console.error("Response text:", text.substring(0, 500));
        return NextResponse.json(
          {
            respondStatus: "ERROR",
            errorMessages: {
              ErrorType: "Server.Error",
              Errors: "Invalid response format from server",
            },
          },
          { status: 500 }
        );
      }
    } else {
      // Non-JSON response (likely HTML error page)
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 500));
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: `Server returned invalid response (status: ${response.status})`,
          },
        },
        { status: response.status || 500 }
      );
    }

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

