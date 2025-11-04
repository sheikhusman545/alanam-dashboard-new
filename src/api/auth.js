import serverConnectAPI from "./config/server-connect-api";

/**
 * Login user
 * @param {string} username - Username/email
 * @param {string} password - Password
 * @param {string} deviceType - Device type (optional)
 * @returns {Promise} API response
 */
export const login = (username, password, deviceType = "web") => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('devicetype', deviceType);

  return serverConnectAPI.post("/login", formData);
};

// Default export for backward compatibility
export default {
  login,
};
