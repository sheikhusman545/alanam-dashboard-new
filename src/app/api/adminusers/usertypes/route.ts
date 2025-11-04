import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";

/**
 * Next.js App Router API Route - User Types endpoint
 * GET /api/adminusers/usertypes - Get all user types
 * POST /api/adminusers/usertypes - Create user type
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from request headers (sent by client)
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    const response = await fetch(`${appConfig.webServerURL}/api/admin/security/usertypes`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: data.message || "Failed to fetch user types",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("User types API error:", error);
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get token from request headers (sent by client)
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {};

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    const response = await fetch(`${appConfig.webServerURL}/api/admin/security/usertypes`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: data.message || "Failed to create user type",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Create user type API error:", error);
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

