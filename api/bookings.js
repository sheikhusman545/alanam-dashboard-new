import serverConnectAPI from "./config/server-connect-api";

/**
 * Get all bookings with optional pagination and sorting
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
  
  return serverConnectAPI.get("/ecom/bookings", queryParams);
};

/**
 * Get booking by ID
 * @param {string} bookingID - Booking ID
 * @returns {Promise} API response
 */
export const getBookingByID = (bookingID) => {
  return serverConnectAPI.get(`/ecom/bookings/${bookingID}`);
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
  return serverConnectAPI.post(`/ecom/bookings/updatestatus/${bookingID}`, formData);
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
  return serverConnectAPI.post(`/ecom/bookings/updatequantity/${bookingID}`, formData);
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
