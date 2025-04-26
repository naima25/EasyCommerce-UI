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
  const [perfumes, setPerfumes] = useState([]);
  const [perfumeNotes, setPerfumeNotes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch perfumes
        const perfumesResponse = await api.get('/perfumes');
        setPerfumes(perfumesResponse.data);

        // Extract unique notes
        const allNotes = perfumesResponse.data.flatMap(p => p.notes.map(n => n.note));
        setPerfumeNotes([...new Set(allNotes)]);

        // Fetch user data if authenticated
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);

          const userId = decodedToken.userId;
          setUserId(userId);

          console.log(userId); // confirm userId is fine

          // Handle favorites and cart gracefully
          const fetchFavorites = api.get(`/favourites/user/${userId}`)
            .then(res => setFavorites(res.data))
            .catch(err => {
              if (err.response?.status === 404) {
                setFavorites([]); // No favorites found
              } else {
                console.error('Failed to fetch favorites:', err);
              }
            });

          const fetchCartItems = api.get(`/cartitems/user/${userId}`)
            .then(res => setCartItems(res.data))
            .catch(err => {
              if (err.response?.status === 404) {
                setCartItems([]); // No cart items found
              } else {
                console.error('Failed to fetch cart items:', err);
              }
            });

          await Promise.all([fetchFavorites, fetchCartItems]);
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    setFavorites([]);
    setCartItems([]);
  };

  // Favorites functions
  const toggleFavorite = async (perfumeId) => {
    if (!isAuthenticated) {
      console.warn('User must be logged in to favorite.');
      return;
    }

    try {
      const existingFavorite = favorites.find(
        (f) => f.perfumeId === perfumeId && f.userId === userId
      );

      if (existingFavorite) {
        await api.delete(`/favourites/${existingFavorite.id}`);
        setFavorites((prev) => prev.filter((f) => f.id !== existingFavorite.id));
      } else {
        const response = await api.post('/favourites', { userId, perfumeId });
        const newFavorite = response.data;
        setFavorites((prev) => [...prev, newFavorite]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };


  // Cart functions
  const addToCart = async (perfumeSizeId, quantity = 1) => {
    try {
      const { data } = await api.post('/cartitems', {
        userId,
        perfumeSizeId,
        quantity
      });

      setCartItems(prev => {
        const existing = prev.find(item =>
          item.perfumeSizeId === data.perfumeSizeId &&
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
      // Find the perfume based on perfumeSizeId
      const perfume = perfumes.find(p => p.sizes.some(size => size.id === item.perfumeSizeId));

      if (!perfume) return sum;  // If no matching perfume is found, skip this item

      // Find the corresponding size for this cart item
      const size = perfume.sizes.find(s => s.id === item.perfumeSizeId);

      // Add the price to the total, considering the quantity of the item
      return sum + (size?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemDetails = (perfumeSizeId) => {
    // Find the perfume based on the perfumeSizeId
    const perfume = perfumes.find(p =>
      p.sizes.some(s => s.id === perfumeSizeId) // Check if the size matches
    );

    if (!perfume) return null;

    // Find the size within the found perfume
    const size = perfume.sizes.find(s => s.id === perfumeSizeId);

    return {
      perfume,
      size
    };
  };
  const isFavorite = (perfumeId) => favorites.some(f => f.perfumeId === perfumeId);
  const getCartItem = (perfumeId) => cartItems.find(item => item.perfumeId === perfumeId);
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
    perfumes,
    perfumeNotes,
    favorites,
    cartItems,
    loading,
    error,

    // Actions
    toggleFavorite,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,

    // Helpers
    isFavorite,
    getCartItem,
    getCartItemById,
    getTotalItems,
    getTotalPrice,
    getCartItemDetails
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);