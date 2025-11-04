import { create } from "apisauce";
import { getToken } from "./storage";
import appConfig from './app-config';

/**
 * Modern API client configuration
 */
const serverConnectAPI = create({
  baseURL: `${appConfig.webServerURL}/api/admin`,
  headers: { 
    "Content-Type": "application/json;charset=UTF-8", 
    "Accept": "*/*",
  },
  timeout: 30000, // 30 second timeout
});

// Add authentication token to all requests
serverConnectAPI.addAsyncRequestTransform(async (request) => {
  const authToken = await getToken();
  if (authToken) {
    request.headers["x-auth-token"] = authToken;
  }
});

// Add response transformation for consistent error handling
serverConnectAPI.addResponseTransform((response) => {
  if (!response.ok) {
    // Handle network errors
    if (!response.data) {
      response.data = {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: response.problem || "Network error occurred"
        }
      };
    }
  }
});

export default serverConnectAPI;
