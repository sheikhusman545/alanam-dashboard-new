import serverConnectAPI from "./config/server-connect-api";
import { LoginRequest, LoginApiResponse } from "@/types/api";

/**
 * Login user
 * @param username - Username/email
 * @param password - Password
 * @param deviceType - Device type (optional)
 * @returns Promise with API response
 */
export const login = async (
  username: string,
  password: string,
  deviceType: string = "web"
) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("devicetype", deviceType);

  return serverConnectAPI.post<LoginApiResponse>("/login", formData);
};

// Default export for backward compatibility
export default {
  login,
};

