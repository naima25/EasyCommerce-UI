import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);

  // Load cart items from the API
  useEffect(() => {
    let isMounted = true;
    axios.get('http://localhost:5172/api/cartitem')
      .then(({ data }) => {
        if (data.length === 0) {
          if (isMounted) {
            setCartItems([]);
            setCartLoading(false);
          }
          return;
        }
        return Promise.all(
          data.map(item =>
            axios.get(`http://localhost:5172/api/product/${item.productId}`)
              .then(({ data: prod }) => ({
                ...item, // includes item.id, quantity, productId, price
                product: {
                  id: prod.id,
                  name: prod.name,
                  price: prod.price,
                  imageUrl: prod.imageUrl,
                }
              }))
          )
        );
      })
      .then(enrichedItems => {
        if (isMounted && enrichedItems) {
          setCartItems(enrichedItems);
          setCartLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setCartError(err.message);
          setCartLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Add item to the cart
  const addToCart = (product) => {
    const existing = cartItems.find(item => item.productId === product.id);
    if (existing) {
      const newQty = existing.quantity + product.quantity;
      axios.put(`http://localhost:5172/api/cartitem/${existing.id}`, {
        quantity: newQty,
        productId: existing.productId,
        price: existing.price,
      })
        .then(() => {
          setCartItems(items =>
            items.map(i =>
              i.id === existing.id
                ? { ...i, quantity: newQty }
                : i
            )
          );
        })
        .catch(console.error);
    } else {
      axios.post('http://localhost:5172/api/cartitem', {
        quantity: product.quantity,
        productId: product.id,
        price: product.price,
      })
        .then(({ data: newItem }) => {
          setCartItems(items => [
            ...items,
            {
              ...newItem, // includes id, quantity, productId, price
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              }
            }
          ]);
        })
        .catch(console.error);
    }
  };

  // Update item quantity in the cart
  const updateQuantity = (itemId, delta) => {
    const target = cartItems.find(i => i.id === itemId);
    if (!target) return;

    const newQty = Math.max(target.quantity + delta, 1);
    const updatedItem = {
      id: target.id,
      quantity: newQty,
      productId: target.productId,
      price: target.price,
    };

    axios.put(`http://localhost:5172/api/cartitem/${itemId}`, updatedItem)
      .then(() => {
        setCartItems(items =>
          items.map(i =>
            i.id === itemId ? { ...i, quantity: newQty } : i
          )
        );
      })
      .catch((error) => {
        console.error("Error updating cart item:", error.response ? error.response.data : error.message);
      });
  };

  // Remove item from the cart
  const removeFromCart = (itemId) => {
    axios.delete(`http://localhost:5172/api/cartitem/${itemId}`)
      .then(() => {
        setCartItems(items => items.filter(i => i.id !== itemId));
      })
      .catch(console.error);
  };

  // Create order based on cart items
  const createOrder = async () => {
    try {
      const orderPayload = {
        orderDate: new Date().toISOString(),
        totalAmount: cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
      };

      console.log("Order payload:", orderPayload);

      const { data: order } = await axios.post('http://localhost:5172/api/order', orderPayload);

      // ✅ Clear cart from backend using correct item IDs
      await Promise.all(cartItems.map(item => {
        if (!item.id) {
          console.warn("Missing ID for item:", item);
          return null;
        }
        return axios.delete(`http://localhost:5172/api/cartitem/${item.id}`);
      }));

      setCartItems([]);

      return order;
    } catch (error) {
      console.error("Failed to create order:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartLoading,
      cartError,
      addToCart,
      updateQuantity,
      removeFromCart,
      createOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
};
