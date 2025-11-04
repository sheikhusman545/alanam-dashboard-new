import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";
import { getToken } from "@/api/config/storage";

/**
 * Next.js App Router API Route - Categories endpoint
 * GET /api/categories - Get all categories
 * POST /api/categories - Create category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    
    // Convert search params to query params
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const authToken = await getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${appConfig.webServerURL}/api/admin/ecom/categories${queryString ? `?${queryString}` : ""}`;

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
            Errors: data.message || "Failed to fetch categories",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Categories API error:", error);
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

    const authToken = await getToken();
    const headers: HeadersInit = {};

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    const response = await fetch(`${appConfig.webServerURL}/api/admin/ecom/categories`, {
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
            Errors: data.message || "Failed to create category",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Create category API error:", error);
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

