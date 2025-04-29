import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);

  // Fetch cart items, then enrich each with its product data
  useEffect(() => {
    let isMounted = true;
    axios.get('http://localhost:5172/api/cartitem')
      .then(({ data }) => {
        // If there are no items, bail early
        if (data.length === 0) {
          if (isMounted) {
            setCartItems([]);
            setCartLoading(false);
          }
          return;
        }
        // For each cartItem, fetch its product details
        return Promise.all(
          data.map(item =>
            axios.get(`http://localhost:5172/api/product/${item.ProductId}`)
                 .then(({ data: prod }) => ({
                   ...item,
                   product: {
                     name: prod.name,
                     price: prod.price,  // Ensure price is passed correctly
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

  // Add a product to the cart (product passed in from your ProductCard)
  const addToCart = (product) => {
    const existing = cartItems.find(item => item.ProductId === product.id);
    if (existing) {
      // Increase quantity
      const newQty = existing.Quantity + product.quantity;
      axios.put(`http://localhost:5172/api/cartitem/${existing.id}`, { Quantity: newQty })
        .then(() => {
          setCartItems(items =>
            items.map(i =>
              i.id === existing.id
                ? { ...i, Quantity: newQty }
                : i
            )
          );
        })
        .catch(console.error);
    } else {
      // Add new
      axios.post('http://localhost:5172/api/cartitem', {
        Quantity: product.quantity,
        OrderId: 1,
        ProductId: product.id,
        Price: product.price, // Ensure price is included in the request
      })
      .then(({ data: newItem }) => {
        // Enrich with product details immediately
        setCartItems(items => [
          ...items,
          {
            ...newItem,
            product: {
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

  // Change quantity by +/-1 (never below 1)
  const updateQuantity = (itemId, delta) => {
    const target = cartItems.find(i => i.id === itemId);
    if (!target) return;
    const newQty = Math.max(target.quantity + delta, 1);
    axios.put(`http://localhost:5172/api/cartitem/${itemId}`, { quantity: newQty })
      .then(() => {
        setCartItems(items =>
          items.map(i =>
            i.id === itemId ? { ...i, quantity: newQty } : i
          )
        );
      })
      .catch(console.error);
  };

  // Remove an item
  const removeFromCart = (itemId) => {
    axios.delete(`http://localhost:5172/api/cartitem/${itemId}`)
      .then(() => {
        setCartItems(items => items.filter(i => i.id !== itemId));
      })
      .catch(console.error);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartLoading,
      cartError,
      addToCart,
      updateQuantity,
      removeFromCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
