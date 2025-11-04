"use client";

// Helper to get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user?.JWT_Token || null;
      }
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Helper to get headers with auth token
const getHeaders = (includeContentType = true) => {
  const token = getToken();
  const headers = {};
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["x-auth-token"] = token;
  }
  return headers;
};

/**
 * Get all user types
 * Uses Next.js API route instead of direct external API call
 * @returns {Promise} API response
 */
export const getUsertypes = () => {
  const headers = getHeaders();
  return fetch("/api/adminusers/usertypes", {
    method: "GET",
    headers,
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

/**
 * Create a new user type
 * @param {string} userType - User type name
 * @returns {Promise} API response
 */
export const createUserType = (userType) => {
  const formData = new FormData();
  formData.append("usertype", userType);
  const headers = getHeaders(false);
  return fetch("/api/adminusers/usertypes", {
    method: "POST",
    headers,
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

/**
 * Update user type
 * @param {string} typeID - User type ID
 * @param {string} userType - Updated user type name
 * @returns {Promise} API response
 */
export const updateUserType = (typeID, userType) => {
  const formData = new FormData();
  formData.append("usertype", userType);
  const headers = getHeaders(false);
  return fetch(`/api/adminusers/usertypes/${typeID}`, {
    method: "POST",
    headers,
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

/**
 * Remove user type
 * @param {string} typeID - User type ID
 * @returns {Promise} API response
 */
export const removeUserType = (typeID) => {
  const headers = getHeaders();
  return fetch(`/api/adminusers/usertypes/${typeID}`, {
    method: "DELETE",
    headers,
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

/**
 * Get all users with optional pagination and sorting
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getUsers = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
  const queryParams = { ...params };
  
  if (sort) queryParams.sb = sort;
  if (pageSize) queryParams.ps = pageSize;
  if (pageNumber) {
    queryParams.page = pageNumber;
    if (pageNumber === "1") {
      queryParams.cnt = "1";
    }
  }
  
  // Use Next.js API route instead of direct external call
  const queryString = new URLSearchParams(queryParams).toString();
  const headers = getHeaders();
  return fetch(`/api/adminusers/users${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers,
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

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Promise} API response
 */
export const createUser = ({
  userType,
  userFullName,
  adminEmail,
  adminPassword,
  permissionCategories,
  permissionProducts,
  permissionOrders,
  permissionUsers,
  permissionReports,
}) => {
  const formData = new FormData();
  formData.append("adminemail", adminEmail);
  formData.append("typeid", userType);
  formData.append("userfullname", userFullName);
  formData.append("adminpassword", adminPassword);
  formData.append("permissionCategories", permissionCategories ? "1" : "0");
  formData.append("permissionProducts", permissionProducts ? "1" : "0");
  formData.append("permissionOrders", permissionOrders ? "1" : "0");
  formData.append("permissionUsers", permissionUsers ? "1" : "0");
  formData.append("permissionReports", permissionReports ? "1" : "0");
  
  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch("/api/adminusers/users", {
    method: "POST",
    headers,
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

/**
 * Update user
 * @param {string} userID - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise} API response
 */
export const updateUser = (
  userID,
  {
    userType,
    userFullName,
    permissionCategories,
    permissionProducts,
    permissionOrders,
    permissionUsers,
    permissionReports,
  }
) => {
  const formData = new FormData();
  formData.append("typeid", userType);
  formData.append("userfullname", userFullName);
  formData.append("permissionCategories", permissionCategories ? "1" : "0");
  formData.append("permissionProducts", permissionProducts ? "1" : "0");
  formData.append("permissionOrders", permissionOrders ? "1" : "0");
  formData.append("permissionUsers", permissionUsers ? "1" : "0");
  formData.append("permissionReports", permissionReports ? "1" : "0");
  
  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch(`/api/adminusers/users/${userID}`, {
    method: "POST",
    headers,
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

/**
 * Remove user
 * @param {string} userID - User ID
 * @returns {Promise} API response
 */
export const removeUser = (userID) => {
  // Use Next.js API route instead of direct external call
  const headers = getHeaders();
  return fetch(`/api/adminusers/users/${userID}`, {
    method: "DELETE",
    headers,
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

/**
 * Update user status
 * @param {string} userID - User ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateStatus = (userID, status) => {
  const formData = new FormData();
  formData.append("status", status);
  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch(`/api/adminusers/users/${userID}?action=status`, {
    method: "POST",
    headers,
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
  getUsertypes,
  createUserType,
  updateUserType,
  removeUserType,
  getUsers,
  createUser,
  updateUser,
  removeUser,
  updatestatus: updateStatus,
};
