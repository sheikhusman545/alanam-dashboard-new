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
 * Get all bookings with optional pagination and sorting
 * Uses Next.js API route instead of direct external API call
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getBookings = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
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
  return fetch(`/api/bookings${queryString ? `?${queryString}` : ""}`, {
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
 * Get booking by ID
 * @param {string} bookingID - Booking ID
 * @returns {Promise} API response
 */
export const getBookingByID = (bookingID) => {
  // Use Next.js API route instead of direct external call
  const headers = getHeaders();
  return fetch(`/api/bookings/${bookingID}`, {
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
 * Update booking status
 * @param {string} bookingID - Booking ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateBookingStatus = (bookingID, status) => {
  const formData = new FormData();
  formData.append("status", status);
  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch(`/api/bookings/${bookingID}?action=status`, {
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
 * Update booking quantity
 * @param {string} bookingID - Booking ID
 * @param {number} quantity - New quantity
 * @returns {Promise} API response
 */
export const updateBookingQuantity = (bookingID, quantity) => {
  const formData = new FormData();
  formData.append("quantity", quantity);
  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch(`/api/bookings/${bookingID}?action=quantity`, {
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
  getAllBookings: getBookings, // Alias for backward compatibility
  getBookings,
  getBookingByID,
  statusChange: updateBookingStatus, // Alias for backward compatibility
  updateBookingStatus,
  updateBookingQuantity,
};
