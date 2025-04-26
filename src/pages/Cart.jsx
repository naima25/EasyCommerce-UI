import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) return <h2>Your cart is empty 🛒</h2>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} style={{ marginBottom: '1rem' }}>
          <h3>{item.name}</h3>
          <p>Price: ${item.price.toFixed(2)}</p>
          <div>
            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
            <span style={{ margin: '0 10px' }}>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
          </div>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
