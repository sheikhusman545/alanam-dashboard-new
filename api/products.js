import serverConnectAPI from "./config/server-connect-api";

/**
 * Create a new product
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

  return serverConnectAPI.post("/ecom/products", formData);
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

  return serverConnectAPI.post(`/ecom/products/update/${productID}`, formData);
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
  
  return serverConnectAPI.get("/ecom/products", queryParams);
};

/**
 * Delete a product
 * @param {string} productID - Product ID
 * @returns {Promise} API response
 */
export const deleteProduct = (productID) => {
  return serverConnectAPI.post(`/ecom/products/delete/${productID}`);
};

/**
 * Get product by ID
 * @param {string} productID - Product ID
 * @returns {Promise} API response
 */
export const getProductByID = (productID) => {
  return serverConnectAPI.get(`/ecom/products/${productID}`);
};

// Default export for backward compatibility
export default {
  createproduct: createProduct,
  getAlProducts,
  updateProduct,
  deleteVal: deleteProduct,
  getProductByID,
};
