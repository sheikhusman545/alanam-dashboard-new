import serverConnectAPI from "./config/server-connect-api";

/**
 * Get all categories with optional pagination and sorting
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
  
  return serverConnectAPI.get("/ecom/categories", queryParams);
};

/**
 * Create a new category
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

  return serverConnectAPI.post("/ecom/categories", formData);
};

/**
 * Update an existing category
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

  return serverConnectAPI.post(`/ecom/categories/update/${categoryID}`, formData);
};

/**
 * Update category status
 * @param {string} categoryID - Category ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateStatus = (categoryID, status) => {
  const formData = new FormData();
  formData.append("status", status);
  
  return serverConnectAPI.post(`/ecom/categories/updatestatus/${categoryID}`, formData);
};

/**
 * Delete a category
 * @param {string} categoryID - Category ID
 * @returns {Promise} API response
 */
export const deleteCategory = (categoryID) => {
  return serverConnectAPI.post(`/ecom/categories/delete/${categoryID}`);
};

/**
 * Get category by ID
 * @param {string} categoryID - Category ID
 * @returns {Promise} API response
 */
export const getCategoryByID = (categoryID) => {
  return serverConnectAPI.get(`/ecom/categories/${categoryID}`);
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
