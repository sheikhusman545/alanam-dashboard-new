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
 * Create a new product
 * Uses Next.js API route instead of direct external API call
 * @param {Object} product - Product data
 * @param {Array} galleryImages - Array of gallery images
 * @param {Array} attributes - Array of product attributes
 * @returns {Promise} API response
 */
export const createProduct = (product, galleryImages = [], attributes = []) => {
  const formData = new FormData();

  // Add product data
  Object.entries(product).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // Add gallery images
  galleryImages.forEach((galleryImage) => {
    if (galleryImage?.newFile && galleryImage?.newImage) {
      formData.append("galleryImages[]", galleryImage.newImage);
    }
  });

  // Add attributes
  attributes.forEach((attribute, index) => {
    formData.append(`attributes[${index}][en_atributeName]`, attribute.en_atributeName || '');
    formData.append(`attributes[${index}][ar_atributeName]`, attribute.ar_atributeName || '');
    
    attribute.atributeitems?.forEach((item, itemIndex) => {
      formData.append(`attributes[${index}][atributeitems][${itemIndex}][en_itemName]`, item.en_itemName || '');
      formData.append(`attributes[${index}][atributeitems][${itemIndex}][ar_itemName]`, item.ar_itemName || '');
      formData.append(`attributes[${index}][atributeitems][${itemIndex}][extraCost]`, item.extraCost || '0');
    });
  });

  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch("/api/products", {
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
 * Update an existing product
 * @param {string} productID - Product ID
 * @param {Object} product - Updated product data
 * @param {Array} galleryImages - Array of gallery images
 * @param {Array} attributes - Array of product attributes
 * @param {Array} removedGalleryImages - Array of gallery image IDs to remove
 * @returns {Promise} API response
 */
export const updateProduct = (
  productID, 
  product, 
  galleryImages = [], 
  attributes = [], 
  removedGalleryImages = []
) => {
  const formData = new FormData();

  // Add product data
  Object.entries(product).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // Add new gallery images
  galleryImages.forEach((galleryImage) => {
    if (galleryImage?.newFile && galleryImage?.newImage) {
      formData.append("galleryImages[]", galleryImage.newImage);
    }
  });

  // Add attributes
  attributes.forEach((attribute, index) => {
    formData.append(`attributes[${index}][en_atributeName]`, attribute.en_atributeName || '');
    formData.append(`attributes[${index}][ar_atributeName]`, attribute.ar_atributeName || '');
    
    attribute.atributeitems?.forEach((item, itemIndex) => {
      formData.append(`attributes[${index}][atributeitems][${itemIndex}][en_itemName]`, item.en_itemName || '');
      formData.append(`attributes[${index}][atributeitems][${itemIndex}][ar_itemName]`, item.ar_itemName || '');
      formData.append(`attributes[${index}][atributeitems][${itemIndex}][extraCost]`, item.extraCost || '0');
    });
  });

  // Add removed gallery images
  removedGalleryImages.forEach((imageID) => {
    if (imageID) {
      formData.append("removedGalleryImages[]", imageID);
    }
  });

  // Use Next.js API route instead of direct external call
  const headers = getHeaders(false);
  return fetch(`/api/products/${productID}`, {
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
 * Get all products with optional pagination and sorting
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getAlProducts = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
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
  return fetch(`/api/products${queryString ? `?${queryString}` : ""}`, {
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
 * Delete a product
 * @param {string} productID - Product ID
 * @returns {Promise} API response
 */
export const deleteProduct = (productID) => {
  // Use Next.js API route instead of direct external call
  const headers = getHeaders();
  return fetch(`/api/products/${productID}`, {
    method: "DELETE",
    headers,
  }).then(async (response) => {
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        const text = await response.text();
        console.error("Response text:", text.substring(0, 200));
        data = {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: "Invalid response format from server",
          },
        };
      }
    } else {
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      data = {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: `Server returned invalid response (status: ${response.status})`,
        },
      };
    }
    return {
      ok: response.ok,
      status: response.status,
      data: data,
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  }).catch((error) => {
    console.error("Network error:", error);
    return {
      ok: false,
      status: 0,
      data: {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: error.message || "Network error. Please check your connection.",
        },
      },
      problem: "NETWORK_ERROR",
    };
  });
};

/**
 * Get product by ID
 * @param {string} productID - Product ID
 * @returns {Promise} API response
 */
export const getProductByID = (productID) => {
  // Use Next.js API route instead of direct external call
  const headers = getHeaders();
  return fetch(`/api/products/${productID}`, {
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

// Default export for backward compatibility
export default {
  createProduct,
  createproduct: createProduct, // Alias for backward compatibility
  getAlProducts,
  updateProduct,
  deleteVal: deleteProduct,
  deleteProduct, // Alias
  getProductByID,
};
