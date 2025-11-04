import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { ApiFunction, ApiResponse } from "@/types/api";
import { UseApiReturn } from "@/types";

/**
 * Modern API hook for handling API requests with loading states and error handling
 * @param apiFunc - The API function to call
 * @returns API state and request function
 */
const useApi = <T = any>(apiFunc: ApiFunction<T>): UseApiReturn<T> => {
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [requestCalled, setRequestCalled] = useState<boolean>(false);

  const request = useCallback(
    async (...args: any[]): Promise<{
      ok: boolean;
      data?: T;
      error?: string;
      [key: string]: any;
    }> => {
      if (loading) {
        return { ok: false, message: "Request already in progress" };
      }

      // Validate that apiFunc is actually a function
      if (typeof apiFunc !== "function") {
        console.error(
          "useApi: apiFunc must be a function, but received:",
          typeof apiFunc,
          apiFunc
        );
        setErrorStatus(true);
        setErrorMessage(
          `API function is not defined. Check your import and function name.`
        );
        setLoading(false);
        return { ok: false, error: "API function is not defined" };
      }

      setRequestCalled(true);
      setLoading(true);
      setErrorStatus(false);
      setErrorMessage("");

      try {
        const response = await apiFunc(...args);

        // Log response for debugging
        if (process.env.NODE_ENV === "development") {
          console.log("API Response:", response);
          console.log("Response ok:", response?.ok);
          console.log("Response status:", response?.status);
          console.log("Response data:", response?.data);
        }

        // CRITICAL: Check for SUCCESS status FIRST, regardless of response.ok
        // Sometimes apisauce marks 200 responses as ok=false, but the data is still valid
        // The API returns: { respondStatus: "SUCCESS", requestedData: {...} }
        
        // Check if response.data has respondStatus === "SUCCESS"
        if (response?.data && (response.data as any).respondStatus === "SUCCESS") {
          setData(response.data as T);
          setErrorStatus(false);
          setErrorMessage("");
          return { ok: true, data: response.data as T };
        }
        
        // Handle direct response (when calling Next.js App Router routes that return JSON directly)
        // Also check if respondStatus is at root level
        if ((response as any)?.respondStatus === "SUCCESS") {
          setData(response as T);
          setErrorStatus(false);
          setErrorMessage("");
          return { ok: true, data: response as T };
        }
        
        // Also check if response.data.respondStatus exists (alternative check)
        if (response?.data && (response.data as any).respondStatus === "SUCCESS") {
          setData(response.data as T);
          setErrorStatus(false);
          setErrorMessage("");
          return { ok: true, data: response.data as T };
        }

        // Also check for success without explicit respondStatus (some APIs return data directly)
        if (
          response?.data &&
          !(response.data as any)?.errorMessages &&
          !(response.data as any)?.error
        ) {
          // If response has data but no error indicators, consider it successful
          // This handles APIs that return data directly without respondStatus
          if (
            (response.data as any).userDetails ||
            (response.data as any).requestedData ||
            (response.data as any).data ||
            (response.data as any).JWT_Token ||
            (response.data as any).jwtToken
          ) {
            setData(response.data as T);
            setErrorStatus(false);
            setErrorMessage("");
            return { ok: true, data: response.data as T };
          }
        }

        // Handle error responses
        if ((response?.data as any)?.errorMessages) {
          const errorMsg = (response.data as any).errorMessages;

          switch (errorMsg.ErrorType) {
            case "UserToken.Error":
              setErrorMessage("Your session has expired. Please login again.");
              router.push("/auth/login");
              return { ok: false, error: "Session expired" };

            case "Permission.Error":
            case "User.Error":
              setErrorMessage(
                errorMsg.Errors || "You do not have permission to perform this action."
              );
              return { ok: false, error: errorMsg.Errors || "Permission denied" };

            case "validation Error":
              setErrorMessage(errorMsg.Errors || "Validation error occurred.");
              setErrorStatus(true);
              return { ok: false, error: errorMsg.Errors || "Validation error" };

            default:
              setErrorMessage(errorMsg.Errors || "An error occurred.");
              setErrorStatus(true);
              return { ok: false, error: errorMsg.Errors || "Unknown error" };
          }
        }

        // Handle unexpected response structure - log for debugging
        console.warn("Unexpected response format:", {
          response,
          responseData: response?.data,
          respondStatus: (response?.data as any)?.respondStatus,
          hasRequestedData: !!(response?.data as any)?.requestedData,
          status: response?.status,
          ok: response?.ok,
          problem: response?.problem,
        });
        setErrorStatus(true);

        // Try to extract any useful error message from the response
        const errorMsg =
          (response?.data as any)?.message ||
          (response?.data as any)?.error ||
          "Unexpected response format from server.";
        setErrorMessage(errorMsg);
        return { ok: false, error: errorMsg, data: response?.data as T };
      } catch (error: any) {
        console.error("API Error:", error);
        setErrorStatus(true);
        setErrorMessage(
          error.message || "Network error. Please check your connection."
        );
        return {
          ok: false,
          error: error.message || "Network error",
        };
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, loading, router]
  );

  // Validate apiFunc on mount/update
  if (typeof apiFunc !== "function") {
    console.error(
      "useApi: apiFunc must be a function, but received:",
      typeof apiFunc,
      apiFunc
    );
    console.error(
      "This usually means the function is not exported correctly or the import path is wrong."
    );
  }

  const reset = useCallback(() => {
    setData(null);
    setErrorStatus(false);
    setErrorMessage("");
    setRequestCalled(false);
    setLoading(false);
  }, []);

  return {
    data,
    errorStatus,
    errorMessage,
    loading,
    requestCalled,
    request,
    reset,
  };
};

export default useApi;

