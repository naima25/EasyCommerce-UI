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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
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
        console.log("after fetching products: ", productsResponse)
        // Get categories
        const categoriesResponse = await api.get('/category');
        setCategories(categoriesResponse.data);

        console.log(productsResponse);
        console.log("before: ");
        console.log("token: ", token)
        // Fetch user data if authenticated
        if (token) {
          const decodedToken = jwtDecode(token);
          console.log("decodedToken: ", decodedToken);
          setUserRole(decodedToken.role);

          const userId = decodedToken.userId;
          console.log("userId: ", userId);
          setUserId(userId);

          console.log("myuserid: ",userId); // confirm userId is fine

          const fetchCart = api.get(`/cart?customerId=${userId}`)
            .then(res => {
              console.log("cart response: ", res)
              console.log("cart: ", res.data)
              setCart(res.data ? res.data[0] : null)
            })
            .catch(err => {
              if (err.response?.status === 404) {
                setCart([]); // No cart items found
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

          await Promise.all([fetchCart, fetchOrders]);
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
    console.log(cart)
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
    setCart([]);
  };
  // products functions
  const getProductsByCategory = async (categoryName) => {
    try {
      const response = await api.get(`/product/byCategory?categoryName=${encodeURIComponent(categoryName)}`);
      setFilteredProducts(response.data);
    } catch (error) {
      setError(error.message);
    }
  }
  

  const addToCart = async (product) => {
    try {
      setLoading(true);
      // await fetchCart();
      // check if cart exists 
      console.log("cart: ", cart)
      const customerId = userId;
      console.log("customerId: ", customerId)
      const updatedItemsMap = new Map();

      // Step 1: Add existing items to the map
      cart?.cartItems?.forEach(item => {
        updatedItemsMap.set(item.productId, {
          productId: item.productId,
          quantity: item.quantity
        });
      });
      
      // Step 2: Update or insert the new product
      if (updatedItemsMap.has(product.id)) {
        const existing = updatedItemsMap.get(product.id);
        updatedItemsMap.set(product.id, {
          productId: product.id,
          quantity: existing.quantity + product.quantity
        });
      } else {
        updatedItemsMap.set(product.id, {
          productId: product.id,
          quantity: product.quantity
        });
      }
      
      // Step 3: Build the request
      const requestBody = {
        customerId,
        cartItems: Array.from(updatedItemsMap.values()),
        price: (cart?.price || 0) + (product.price * product.quantity)
      };
      
      if(cart){
        requestBody.id = cart.id;
        requestBody.customer = cart.customer; 
      }
      let response = null
      console.log("requestBody: ", requestBody)
      // if cart exists, update it. if cart doesn't exists, create it
      if (cart) {
        response = await api.put(`/cart/${cart.id}`, requestBody);
        console.log("updated cart")
      } else {
        response = await api.post('/cart', JSON.stringify(requestBody));
      }
      console.log("response: ", response)

      // if resopnse is not 200 OK, throw an error 
      if (response?.status !== 204 && response?.status !== 201) {
        throw new Error('Failed to add to cart');
      }
      await fetchCart(cart.id,customerId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    // Fetch cart from API
    const fetchCart = async (cartId, customerId) => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5172/api/cart/${cartId}?customerId=${customerId}`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        console.log("data: ", data)
        setCart(data); // Get the most recent cart
        // check if cart is unique, if there is no cart returned 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCart(prev => prev.filter(item => item.id !== cartItemId));
    } catch (err) {
      throw err;
    }
  };

  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    try {
      // Find the cart item with the matching cartItemId
      const cartItem = cart.find(item => item.id === cartItemId);

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
      const response = await api.put(`/cart/${cartItemId}`, updatedCartItem);

      // Check if the server responded with a success (204 No Content)
      if (response.status === 204) {
        // Update the cart items state (since no data is returned, use the updated cartItem)
        setCart(prev =>
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
  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
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
  const getCartItem = (productId) => cart.find(item => item.productId === productId);
  const getCartItemById = (id) => cart.find(item => item.id === id);

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
    filteredProducts,
    setFilteredProducts,
    categories,
    cart,
    loading,
    error,

    // Actions
    getProductsByCategory,
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