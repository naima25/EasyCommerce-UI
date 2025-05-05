import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.config';
import { jwtDecode } from 'jwt-decode';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // App data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("before fetching products: ")
        // Fetch products
        const productsResponse = await api.get('/product');
        setProducts(productsResponse.data);
        console.log("after fetching products: ")
        // Extract unique categories
        // const allCategories = productsResponse.data.flatMap(p => p.notes.map(n => n.note));
        // setCategories([...new Set(allCategories)]);
        console.log(productsResponse);
        console.log("before: ");
        console.log("token: ", token)
        // Fetch user data if authenticated
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);

          const userId = decodedToken.userId;
          setUserId(userId);

          console.log(userId); // confirm userId is fine

          const fetchCartItems = api.get(`/cart`)
            .then(res => setCartItems(res.data))
            .catch(err => {
              if (err.response?.status === 404) {
                setCartItems([]); // No cart items found
              } else {
                console.error('Failed to fetch cart items:', err);
              }
            });

          const fetchOrders = api.get(`/order`)
            .then(res => setOrders(res.data))
            .catch(err => {
              if (err.response?.status === 404) {
                setOrders([]); // No orders found
              } else {
                console.error('Failed to fetch orders:', err);
              }
            });

          await Promise.all([fetchCartItems, fetchOrders]);
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    console.log("after fetching data: ")
    console.log(products);
    console.log(cartItems)
    console.log(orders)
  }, [token]);

  // Auth functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/account/login', { email, password });

      if (!response.data.token) throw new Error('No token received');

      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      setError(message);
      logout();
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
    setUserId(null);
    setCartItems([]);
  };

  // Cart functions
  const addToCart = async (productsizeId, quantity = 1) => {
    try {
      const { data } = await api.post('/cartitems', {
        userId,
        productsizeId,
        quantity
      });

      setCartItems(prev => {
        const existing = prev.find(item =>
          item.productsizeId === data.productsizeId &&
          item.userId === userId
        );

        return existing
          ? prev.map(item => item.id === existing.id ? data : item)
          : [...prev, data];
      });

      return data;
    } catch (err) {
      throw err;
    }
  };


  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cartitems/${cartItemId}`);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (err) {
      throw err;
    }
  };

  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    try {
      // Find the cart item with the matching cartItemId
      const cartItem = cartItems.find(item => item.id === cartItemId);

      // If the cartItem doesn't exist, throw an error
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      // Update the quantity while maintaining other properties of the cart item
      const updatedCartItem = {
        ...cartItem,  // Spread the current cart item to keep other fields unchanged
        quantity: Math.max(1, newQuantity)  // Update the quantity
      };

      // Send the PUT request with the updated cart item
      const response = await api.put(`/cartitems/${cartItemId}`, updatedCartItem);

      // Check if the server responded with a success (204 No Content)
      if (response.status === 204) {
        // Update the cart items state (since no data is returned, use the updated cartItem)
        setCartItems(prev =>
          prev.map(item => item.id === cartItemId ? updatedCartItem : item)
        );
      } else {
        throw new Error('Failed to update cart item');
      }

    } catch (err) {
      console.error('Error updating cart item:', err);
      throw err;
    }
  };


  // Helper functions
  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      // Find the product based on productsizeId
      const product = products.find(p => p.sizes.some(size => size.id === item.productsizeId));

      if (!product) return sum;  // If no matching product is found, skip this item

      // Find the corresponding size for this cart item
      const size = product.sizes.find(s => s.id === item.productsizeId);

      // Add the price to the total, considering the quantity of the item
      return sum + (size?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemDetails = (productsizeId) => {
    // Find the product based on the productsizeId
    const product = products.find(p =>
      p.sizes.some(s => s.id === productsizeId) // Check if the size matches
    );

    if (!product) return null;

    // Find the size within the found product
    const size = product.sizes.find(s => s.id === productsizeId);

    return {
      product,
      size
    };
  };
  const getCartItem = (productId) => cartItems.find(item => item.productId === productId);
  const getCartItemById = (id) => cartItems.find(item => item.id === id);

  const value = {
    // Auth
    isAuthenticated,
    userRole,
    userId,
    token,
    login,
    logout,

    // Data
    products,
    categories,
    cartItems,
    loading,
    error,

    // Actions
    addToCart,
    removeFromCart,
    updateCartItemQuantity,

    // Helpers
    getCartItem,
    getCartItemById,
    getTotalItems,
    getTotalPrice,
    getCartItemDetails
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);