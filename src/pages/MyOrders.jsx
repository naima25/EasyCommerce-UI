import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; // Using CartContext to manage cart items

const MyOrders = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart(); // Using CartContext to manage cart items
  const [editingId, setEditingId] = useState(null);

  // Handle increase of item quantity
  const handleIncrease = (itemId) => {
    console.log("Increase clicked for item:", itemId);
    updateQuantity(itemId, 1);  // Increase quantity by 1
  };

  // Handle decrease of item quantity
  const handleDecrease = (itemId) => {
    console.log("Decrease clicked for item:", itemId);
    updateQuantity(itemId, -1);  // Decrease quantity by 1 (cannot go below 1)
  };

  // Handle removal of item from cart
  const handleRemove = (itemId) => {
    console.log("Remove clicked for item:", itemId);
    removeFromCart(itemId);  // Remove item from the cart
  };

  return (
    <div>
      <h1>My Orders</h1>
      {cartItems.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {cartItems.map((order) => (
            <li key={order.id}>
              <strong>ID:</strong> {order.id} <br />
              <strong>Date:</strong> {order.orderDate} <br />
              {/* Safeguard for possible missing product details */}
              <strong>Product:</strong> {order.product?.name || 'Unknown Product'} <br />
              <strong>Price:</strong> ${order.product?.price ? order.product.price.toFixed(2) : 'N/A'} <br />
              <strong>Quantity:</strong> 
              <div className="cart-item-quantity">
                <button onClick={() => handleDecrease(order.id)}>-</button>
                <span className="cart-item-quantity-number">{order.quantity}</span>
                <button onClick={() => handleIncrease(order.id)}>+</button>
              </div>
              <br />
              <strong>Total:</strong> ${(order.product?.price * order.quantity).toFixed(2)} 
              <button onClick={() => handleRemove(order.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;

