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
 * Get product-wise report with optional pagination and sorting
 * Uses Next.js API route instead of direct external API call
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getProductWiseReport = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
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
  return fetch(`/api/reports/productwise${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers,
  }).then(async (response) => {
    const contentType = response.headers.get("content-type");
    let data;
    
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      data = {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: "Invalid response format from server",
        },
      };
      return {
        ok: false,
        status: response.status,
        data: data,
        problem: "CLIENT_ERROR",
      };
    }
    
    data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data: data,
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  });
};

/**
 * Get category-wise report with optional pagination and sorting
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getCategoryWiseReport = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
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
  return fetch(`/api/reports/categorywise${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers,
  }).then(async (response) => {
    const contentType = response.headers.get("content-type");
    let data;
    
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      data = {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: "Invalid response format from server",
        },
      };
      return {
        ok: false,
        status: response.status,
        data: data,
        problem: "CLIENT_ERROR",
      };
    }
    
    data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data: data,
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  });
};

/**
 * Get date-wise report with optional pagination and sorting
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getDateWiseReport = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
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
  return fetch(`/api/reports/datewise${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers,
  }).then(async (response) => {
    const contentType = response.headers.get("content-type");
    let data;
    
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      data = {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: "Invalid response format from server",
        },
      };
      return {
        ok: false,
        status: response.status,
        data: data,
        problem: "CLIENT_ERROR",
      };
    }
    
    data = await response.json();
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
  getProductWiseReport,
  getCategoryWiseReport,
  getDateWiseReport,
};
