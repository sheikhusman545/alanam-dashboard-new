import { NextRequest, NextResponse } from "next/server";
import appConfig from "@/api/config/app-config";

/**
 * Next.js App Router API Route - User by ID
 * POST /api/adminusers/users/[id] - Update user or update status
 * DELETE /api/adminusers/users/[id] - Delete user
 */
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

    // Handle status update separately
    let url = `${appConfig.webServerURL}/api/admin/security/users/update/${id}`;
    if (action === "status") {
      url = `${appConfig.webServerURL}/api/admin/security/users/updatestatus/${id}`;
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
            Errors: data.message || "Failed to update user",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Update user API error:", error);
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

    const response = await fetch(`${appConfig.webServerURL}/api/admin/security/users/delete/${id}`, {
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
            Errors: data.message || "Failed to delete user",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Delete user API error:", error);
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

