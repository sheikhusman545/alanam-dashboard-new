import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";

/**
 * Next.js App Router API Route - Booking by ID
 * GET /api/bookings/[id] - Get booking by ID
 * POST /api/bookings/[id] - Update booking (status or quantity)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get token from request headers (sent by client)
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    const response = await fetch(`${appConfig.webServerURL}/api/admin/ecom/bookings/${id}`, {
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
            Errors: data.message || "Failed to fetch booking",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Get booking API error:", error);
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const formData = await request.formData();

    // Get token from request headers (sent by client)
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {};

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    // Handle different booking update actions
    let url = `${appConfig.webServerURL}/api/admin/ecom/bookings/updatestatus/${id}`;
    if (action === "status") {
      url = `${appConfig.webServerURL}/api/admin/ecom/bookings/updatestatus/${id}`;
    } else if (action === "quantity") {
      url = `${appConfig.webServerURL}/api/admin/ecom/bookings/updatequantity/${id}`;
    }

    const response = await fetch(url, {
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
            Errors: data.message || "Failed to update booking",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Update booking API error:", error);
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

