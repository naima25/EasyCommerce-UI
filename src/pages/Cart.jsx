import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, loading, error } = useCart();

  useEffect(() => {
    if (cart) {
      console.log('Cart loaded:', cart);
    }
  }, [cart]);

  if (loading) return <div>Loading your cart...</div>;
  if (error) return <div>Error: {error}</div>;

  const allCartItems = cart?.flatMap((c) => c.cartItems || []) || [];

  return (
    <div>
      <h1>Your Cart</h1>

      <br />

      {allCartItems.length > 0 ? (
        allCartItems.map((item) => (
          <div key={item.id}>
            <img src={item.product.imageUrl} alt={item.product.name} width="100" />

            <h3>{item.product.name}</h3>

            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.product.price.toFixed(2)}</p>

            <hr />
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
