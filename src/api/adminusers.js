import serverConnectAPI from "./config/server-connect-api";

/**
 * Get all user types
 * @returns {Promise} API response
 */
export const getUsertypes = () => {
  return serverConnectAPI.get("/security/usertypes");
};

/**
 * Create a new user type
 * @param {string} userType - User type name
 * @returns {Promise} API response
 */
export const createUserType = (userType) => {
  const formData = new FormData();
  formData.append("usertype", userType);
  return serverConnectAPI.post("/security/usertypes", formData);
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
  return serverConnectAPI.post(`/security/usertypes/update/${typeID}`, formData);
};

/**
 * Remove user type
 * @param {string} typeID - User type ID
 * @returns {Promise} API response
 */
export const removeUserType = (typeID) => {
  return serverConnectAPI.post(`/security/usertypes/delete/${typeID}`);
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
  
  return serverConnectAPI.get("/security/users", queryParams);
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
  
  return serverConnectAPI.post("/security/users", formData);
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
  
  return serverConnectAPI.post(`/security/users/update/${userID}`, formData);
};

/**
 * Remove user
 * @param {string} userID - User ID
 * @returns {Promise} API response
 */
export const removeUser = (userID) => {
  return serverConnectAPI.post(`/security/users/delete/${userID}`);
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
  return serverConnectAPI.post(`/security/users/updatestatus/${userID}`, formData);
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
