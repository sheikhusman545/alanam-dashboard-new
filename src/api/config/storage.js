const key = "user";

// localStorage is synchronous, not async
const storeUser = (userData) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(userData));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error storing the user data", error);
    return false;
  }
};

export const getUser = () => {
  try {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem(key);
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  } catch (error) {
    console.error("Error getting the user data", error);
    return null;
  }
};

export const getToken = () => {
  const storedUser = getUser();
  return storedUser ? storedUser.JWT_Token : null;
};

const deleteUser = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error removing the user data", error);
    return false;
  }
};

const storeCart = async (cart) => {
  try {
    await localStorage.setItem('fadi-cart', JSON.stringify(cart));
  } catch (error) {
    console.log("Error storing the auth token", error);
  }
};

const getCart = async () => {
  try {
    return await localStorage.getItem('fadi-cart');
  } catch (error) {
    console.log("Error getting the auth token", error);
    return [];
  }
};

const storeWishlist = async (wishlist) => {
  try {
    await localStorage.setItem('fadi-wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.log("Error storing the auth token", error);
  }
};

const getWishlist = async () => {
  try {
    return await localStorage.getItem('fadi-wishlist');
  } catch (error) {
    console.log("Error getting the auth token", error);
    return [];

  }
};

export default { storeCart, getCart, storeWishlist, getWishlist, storeUser, getUser, getToken, deleteUser };
