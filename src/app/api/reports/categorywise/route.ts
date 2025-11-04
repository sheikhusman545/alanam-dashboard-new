import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

/**
 * Next.js App Router API Route - Category-wise report endpoint
 * GET /api/reports/categorywise
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    
    // Convert search params to query params
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Get token from request headers (sent by client)
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${appConfig.webServerURL}/api/admin/ecom/reports/orderscategorywise${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
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
            Errors: data.message || "Failed to fetch category-wise report",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Category-wise report API error:", error);
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

