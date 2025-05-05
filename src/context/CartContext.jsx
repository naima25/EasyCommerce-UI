import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [currentCart, setCurrentCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the cart directly from the backend
  useEffect(() => {
    setLoading(true); // Set loading to true when starting the request
    setError(null);   // Reset any previous error

    // Fetch the cart from the backend directly using axios
    axios
      .get('http://localhost:5172/api/cart', {
        params: { customerId: 'd21abdb3-4a86-4995-a454-3a7b90d08622' }, // Directly pass customerId
        headers: { 'Content-Type': 'application/json' }
      })
      .then((response) => {
        // Once we have the response, set the cart and loading states
        setCurrentCart(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // In case of error, update the error state and set loading to false
        setError(err.message || 'Failed to fetch cart');
        setLoading(false);
      });
  }, []); // The empty dependency array ensures this runs only once when the component mounts

  return (
    <CartContext.Provider
      value={{
        cart: currentCart,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
