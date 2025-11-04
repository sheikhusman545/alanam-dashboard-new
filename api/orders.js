import serverConnectAPI from "./config/server-connect-api";

/**
 * Get all orders with optional pagination and sorting
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
  
  return serverConnectAPI.get("/ecom/orders", queryParams);
};

/**
 * Get order by ID
 * @param {string} orderID - Order ID
 * @returns {Promise} API response
 */
export const getOrderByID = (orderID) => {
  return serverConnectAPI.get(`/ecom/orders/${orderID}`);
};

/**
 * Update order status
 * @param {string} orderID - Order ID
 * @param {string} newStatus - New status value
 * @returns {Promise} API response
 */
export const statusChange = (orderID, newStatus) => {
  const formData = new FormData();
  formData.append("status", newStatus);
  
  return serverConnectAPI.post(`/ecom/orders/updatestatus/${orderID}`, formData);
};

// Default export for backward compatibility
export default {
  getAllOrders,
  getOrderByID,
  statusChange,
};
