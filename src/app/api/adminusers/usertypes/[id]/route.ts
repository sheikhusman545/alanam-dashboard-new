import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";

/**
 * Next.js App Router API Route - User Type by ID
 * POST /api/adminusers/usertypes/[id] - Update user type
 * DELETE /api/adminusers/usertypes/[id] - Delete user type
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.formData();

    // Get token from request headers (sent by client)
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {};

    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    const response = await fetch(`${appConfig.webServerURL}/api/admin/security/usertypes/update/${id}`, {
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
            Errors: data.message || "Failed to update user type",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Update user type API error:", error);
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

export async function DELETE(
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

    const response = await fetch(`${appConfig.webServerURL}/api/admin/security/usertypes/delete/${id}`, {
      method: "POST",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: data.message || "Failed to delete user type",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Delete user type API error:", error);
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

