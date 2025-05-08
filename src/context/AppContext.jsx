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
          setUserRole(decodedToken.role === "Admin" ? "Admin" : "User");

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


    const removeFromCart = async (productId) => {
      try {
        setLoading(true);
        
        if (!cart) {
          throw new Error('No cart exists');
        }
  
        // Find the item to remove
        const itemToRemove = cart.cartItems.find(item => item.productId === productId);
        if (!itemToRemove) {
          throw new Error('Item not found in cart');
        }
  
        // Calculate new price
        const newPrice = cart.price - (itemToRemove.quantity * itemToRemove.product.price);
  
        // Filter out the removed item
        const updatedCartItems = cart.cartItems.filter(item => item.productId !== productId);
  
        // Prepare the request body
        const requestBody = {
          customerId: userId,
          cartItems: updatedCartItems,
          price: newPrice,
          id: cart.id,
          customer: cart.customer
        };
  
        // Update the cart on the server
        const response = await api.put(`/cart/${cart.id}`, requestBody);
  
        if (response?.status !== 204) {
          throw new Error('Failed to remove item from cart');
        }
  
        // Update local state
        setCart(prevCart => ({
          ...prevCart,
          cartItems: updatedCartItems,
          price: newPrice
        }));
  
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    };
  
    const updateCartItemQuantity = async (productId, newQuantity) => {
      try {
        setLoading(true);
        
        if (!cart) {
          throw new Error('No cart exists');
        }
  
        // Find the item to update
        const itemIndex = cart.cartItems.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
          throw new Error('Item not found in cart');
        }
  
        // Calculate price difference
        const oldItem = cart.cartItems[itemIndex];
        const priceDifference = (newQuantity - oldItem.quantity) * oldItem.product.price;
        const newPrice = cart.price + priceDifference;
  
        // Update the item's quantity
        const updatedCartItems = [...cart.cartItems];
        updatedCartItems[itemIndex] = {
          ...updatedCartItems[itemIndex],
          quantity: newQuantity
        };
  
        // Prepare the request body
        const requestBody = {
          customerId: userId,
          cartItems: updatedCartItems,
          price: newPrice,
          id: cart.id,
          customer: cart.customer
        };
  
        // Update the cart on the server
        const response = await api.put(`/cart/${cart.id}`, requestBody);
  
        if (response?.status !== 204) {
          throw new Error('Failed to update cart item quantity');
        }
  
        // Update local state
        setCart(prevCart => ({
          ...prevCart,
          cartItems: updatedCartItems,
          price: newPrice
        }));
  
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    };
  
    const clearCart = async () => {
      try {
        setLoading(true);
        
        if (!cart) {
          throw new Error('No cart exists');
        }
  
        // Update the cart on the server
        const response = await api.put(`/cart/${cart.id}`, {
          customerId: userId,
          cartItems: [],
          price: 0,
          id: cart.id,
          customer: cart.customer
        });
  
        if (response?.status !== 204) {
          throw new Error('Failed to clear cart');
        }
  
        // Update local state
        setCart(prevCart => ({
          ...prevCart,
          cartItems: [],
          price: 0
        }));
  
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    };


    // orders
    const createOrder = async () => {
      try {
        setLoading(true);
        
        if (!cart || cart.cartItems.length === 0) {
          throw new Error('Cart is empty');
        }
    
        const orderDate = new Date().toISOString();
        
        const orderItems = cart.cartItems.map(item => ({
          productId: item.productId,
          product: item.product,
          quantity: item.quantity
        }));
    
        const requestBody = {
          customerId: userId,
          price: cart.price,
          orderDate: orderDate,
          orderItems: orderItems
        };
    
        const response = await api.post('/order', requestBody);
    
        if (response.status !== 201) {
          throw new Error('Failed to create order');
        }
    
        // Clear the cart after successful order creation
        await clearCart();
    
        // Refresh orders list
        const ordersResponse = await api.get('/order');
        setOrders(ordersResponse.data);
    
        return { success: true, order: response.data };
      } catch (err) {
        setError(err.message);
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    };

    // Add these to your AppContext provider
const cancelOrder = async (orderId) => {
  try {
    setLoading(true);
    const response = await api.delete(`/order/${orderId}`);
    
    if (response.status !== 204) {
      throw new Error('Failed to cancel order');
    }

    // Update local orders state
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    
    return true;
  } catch (err) {
    setError(err.message);
    return false;
  } finally {
    setLoading(false);
  }
};

const updateOrderItemQuantity = async (orderId, orderItemId, newQuantity) => {
  try {
    setLoading(true);
    
    // Find the order to update
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (!orderToUpdate) {
      throw new Error('Order not found');
    }

    // Find and update the item
    const updatedOrderItems = orderToUpdate.orderItems.map(item => {
      if (item.id === orderItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

  
    // Calculate new total price
    const newPrice = updatedOrderItems.reduce(
      (total, item) => total + (item.quantity * item.product.price),
      0
    );

    // Prepare request body
    const requestBody = {
      id: orderId, // Order ID
      customerId: orderToUpdate.customerId, // Customer ID
      price: newPrice, // The updated price
      orderDate: orderToUpdate.orderDate, // The updated order date
      orderItems: updatedOrderItems.map(item => ({
        id: item.id, // Order item ID (used to identify the specific item being updated)
        productId: item.productId, // The product ID
        quantity: item.quantity, // Updated quantity
        product: item.product // Full product details (name, price, etc.)
      }))
    };
    
    

    // Update on server
    console.log('Sending update:', requestBody);
    const response = await api.put(`/order/${orderId}`, requestBody);
    console.log('Update response:', response);
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to update order item quantity');
    }

    // Update local state
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, orderItems: updatedOrderItems, price: newPrice }
          : order
      )
    );

    return true;
  } catch (err) {
    console.error('Update quantity error:', err); 
    setError(err.message);
    return false;
  } finally {
    setLoading(false);
  }
};

const removeOrderItem = async (orderId, orderItemId) => {
  try {
    setLoading(true);
    
    // Find the order to update
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (!orderToUpdate) {
      throw new Error('Order not found');
    }

    // Find the item to remove
    const itemToRemove = orderToUpdate.orderItems.find(item => item.id === orderItemId);
    console.log("Item to Remove:", itemToRemove);
    if (!itemToRemove) {
      console.log("Item not found");
      throw new Error('Order item not found');
    }

    // Filter out the removed item
    const updatedOrderItems = orderToUpdate.orderItems.filter(
      item => item.id !== orderItemId
    );

    // Calculate new total price
    const newPrice = orderToUpdate.price - (itemToRemove.quantity * itemToRemove.product.price);
    console.log(updatedOrderItems); // Log to verify

    // Prepare request body
    const requestBody = {
      id: orderId, // Order ID
      customerId: orderToUpdate.customerId, // Customer ID
      price: newPrice, // The updated price
      orderDate: orderToUpdate.orderDate, // The updated order date
      orderItems: updatedOrderItems.map(item => ({
        id: item.id, // Order item ID (used to identify the specific item being updated)
        productId: item.productId, // The product ID
        quantity: item.quantity, // Updated quantity
        product: item.product // Full product details (name, price, etc.)
      }))
    };
    
    console.log("Request Body:", requestBody); // Log to verify request body
    

    // Update on server
    const response = await api.put(`/order/${orderId}`, requestBody);

    if (response.status !== 204) {
      throw new Error('Failed to remove order item');
    }

    // Update local state
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, orderItems: updatedOrderItems, price: newPrice }
          : order
      )
    );

    return true;
  } catch (err) {
    setError(err.message);
    return false;
  } finally {
    setLoading(false);
  }
};


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
    orders,
    loading,
    error,

    // Actions
    getProductsByCategory,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    fetchCart,
    createOrder, 
    cancelOrder,
    updateOrderItemQuantity,
    removeOrderItem

  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);