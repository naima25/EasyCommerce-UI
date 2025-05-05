import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const customerId = "d21abdb3-4a86-4995-a454-3a7b90d08622";

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5172/api/cart?customerId=${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data[data.length - 1]); // Get the most recent cart
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart function
  const addToCart = async (product) => {
    try {
      setLoading(true);
      const requestBody = {
        customerId,
        cartItems: [
          ...(cart?.cartItems?.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })) || []),
          {
            productId: product.id,
            quantity: product.quantity
          }
        ],
        price: (cart?.price || 0) + (product.price * product.quantity)
      };

      const response = await fetch('http://localhost:5172/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to update cart');
      await fetchCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Updated removeFromCart function to include cartId
  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);

      if (!cart) {
        throw new Error('Cart is empty or not loaded');
      }

      // We assume cart contains a unique cartId
      const cartId = cart.id;

      // If no cart ID is present, we can't delete
      if (!cartId) {
        throw new Error('Cart ID is missing');
      }

      // Attempt to delete the cart item by cartId and cartItemId
      const response = await fetch(`http://localhost:5172/api/cart/${cartId}/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // If the response is not okay, throw an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item');
      }

      // Re-fetch the cart to update the UI
      await fetchCart();
      return true; // Indicate success
    } catch (err) {
      setError(err.message);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      error, 
      addToCart, 
      removeFromCart, // Add the updated removeFromCart function to context
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
