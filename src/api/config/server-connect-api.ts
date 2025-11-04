import { create } from "apisauce";
import { getToken } from "./storage";
import appConfig from "./app-config";
import { ApiResponse } from "@/types";

/**
 * Modern API client configuration with TypeScript support
 * SSR-safe: Mock location for axios compatibility during SSR
 */
// For SSR, ensure we don't use browser-specific code
if (typeof window === 'undefined') {
  // In Node.js, axios will use http adapter automatically
  // But we need to ensure it doesn't try to access location
  try {
    // Mock location if it doesn't exist (for axios compatibility)
    if (typeof global !== 'undefined' && !(global as any).location) {
      (global as any).location = { href: 'http://localhost' };
    }
  } catch (e) {
    // Ignore errors
  }
}

// Create API client (apisauce/axios handles SSR internally)
const serverConnectAPI = create({
  baseURL: `${appConfig.webServerURL}/api/admin`,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "*/*",
  },
  timeout: 30000,
});

// Add authentication token to all requests (only if client-side)
if (typeof window !== 'undefined') {
  serverConnectAPI.addAsyncRequestTransform(async (request) => {
    const authToken = await getToken();
    if (authToken && request.headers) {
      request.headers["x-auth-token"] = authToken;
    }
  });
}

// Add response transformation for consistent error handling
serverConnectAPI.addResponseTransform((response) => {
  if (!response.ok) {
    // Handle network errors
    if (!response.data) {
      response.data = {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: response.problem || "Network error occurred",
        },
      } as ApiResponse;
    }
  }
});

export default serverConnectAPI;

