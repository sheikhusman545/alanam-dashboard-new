"use client";

/**
 * Login user
 * Uses Next.js API route instead of direct external API call
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

  // Use Next.js API route instead of direct external call
  return fetch("/api/auth/login", {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data: data,
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  });
};

// Default export for backward compatibility
export default {
  login,
};
