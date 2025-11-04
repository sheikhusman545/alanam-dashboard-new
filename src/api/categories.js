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
 * Get all categories with optional pagination and sorting
 * Uses Next.js API route instead of direct external API call
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getAlCategories = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
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
  
  return fetch(`/api/categories${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers,
  }).then(async (response) => {
    const data = await response.json();
    // Return apisauce-compatible format
    return {
      ok: response.ok,
      status: response.status,
      data: data,
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  });
};

/**
 * Create a new category
 * Uses Next.js API route instead of direct external API call
 * @param {Object} category - Category data
 * @returns {Promise} API response
 */
export const createCategory = (category) => {
  const formData = new FormData();
  
  Object.entries(category).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // Use Next.js API route instead of direct external call
  // Return format compatible with apisauce for useApi hook
  const headers = getHeaders(false);
  return fetch("/api/categories", {
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
 * Update an existing category
 * Uses Next.js API route instead of direct external API call
 * @param {string} categoryID - Category ID
 * @param {Object} category - Updated category data
 * @returns {Promise} API response
 */
export const updateCategory = (categoryID, category) => {
  const formData = new FormData();
  
  Object.entries(category).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // Use Next.js API route instead of direct external call (POST for update)
  // Return format compatible with apisauce for useApi hook
  const headers = getHeaders(false);
  return fetch(`/api/categories/${categoryID}`, {
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
 * Update category status
 * Uses Next.js API route - we'll need to add a status endpoint or use a query param
 * @param {string} categoryID - Category ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateStatus = (categoryID, status) => {
  const formData = new FormData();
  formData.append("status", status);
  
  // Use Next.js API route with action=status query param
  // Return format compatible with apisauce for useApi hook
  const token = typeof window !== 'undefined' ? (() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user?.JWT_Token || null;
      }
    } catch (e) {}
    return null;
  })() : null;
  
  const headers = {};
  if (token) headers["x-auth-token"] = token;
  
  return fetch(`/api/categories/${categoryID}?action=status`, {
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
 * Delete a category
 * Uses Next.js API route instead of direct external API call
 * @param {string} categoryID - Category ID
 * @returns {Promise} API response
 */
export const deleteCategory = (categoryID) => {
  // Use Next.js API route instead of direct external call
  // Return format compatible with apisauce for useApi hook
  const headers = getHeaders();
  return fetch(`/api/categories/${categoryID}`, {
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
 * Get category by ID
 * Uses Next.js API route instead of direct external API call
 * @param {string} categoryID - Category ID
 * @returns {Promise} API response
 */
export const getCategoryByID = (categoryID) => {
  // Use Next.js API route instead of direct external call
  // Return format compatible with apisauce for useApi hook
  return fetch(`/api/categories/${categoryID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
  getAlCategories,
  createCategory,
  updateCategory,
  updatestatus: updateStatus,
  deleteVal: deleteCategory,
  getCategoryByID,
};
