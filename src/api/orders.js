"use client";

// Ensure location polyfill exists before any axios/apisauce imports
if (typeof window === 'undefined' && typeof location === 'undefined') {
  const locationMock = {
    href: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:3000',
  };
  if (typeof global !== 'undefined') {
    global.location = locationMock;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.location = locationMock;
  }
}

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
 * Get all orders with optional pagination and sorting
 * Uses Next.js API route instead of direct external API call
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getAllOrders = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
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
  // Return format compatible with apisauce for useApi hook
  const queryString = new URLSearchParams(queryParams).toString();
  const headers = getHeaders();
  return fetch(`/api/orders${queryString ? `?${queryString}` : ""}`, {
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
 * Get order by ID
 * Uses Next.js API route instead of direct external API call
 * @param {string} orderID - Order ID
 * @returns {Promise} API response
 */
export const getOrderByID = (orderID) => {
  // Use Next.js API route instead of direct external call
  const headers = getHeaders();
  return fetch(`/api/orders/${orderID}`, {
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
 * Update order status
 * Uses Next.js API route instead of direct external API call
 * @param {string} orderID - Order ID
 * @param {string} newStatus - New status value
 * @returns {Promise} API response
 */
export const statusChange = (orderID, newStatus) => {
  const formData = new FormData();
  formData.append("status", newStatus);
  
  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch(`/api/orders/${orderID}?action=status`, {
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
  getAllOrders,
  getOrderByID,
  statusChange,
};
