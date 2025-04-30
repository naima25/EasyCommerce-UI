import React from 'react';
import { useCart } from '../context/CartContext';  // Importing Cart Context
import { useNavigate } from 'react-router-dom';    // For navigation
import axios from 'axios';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, createOrder } = useCart();
  const navigate = useNavigate();

  const handleIncrease = (itemId) => {
    console.log("Increase clicked for item:", itemId);
    updateQuantity(itemId, 1);
  };

  const handleDecrease = (itemId) => {
    console.log("Decrease clicked for item:", itemId);
    updateQuantity(itemId, -1);
  };

  const handleRemove = async (itemId) => {
    console.log("Remove clicked for item:", itemId);
    try {
      removeFromCart(itemId);
      
      // If the item is the last item in the cart, we remove the order from the backend
      if (cartItems.length === 1) {
        const orderId = cartItems[0].orderId;  // Assuming the orderId is here
        await axios.delete(`http://localhost:5172/api/order/${orderId}`);
        console.log("Order deleted from backend");
        navigate('/');  // Navigate to homepage or relevant page
      }
    } catch (error) {
      console.error("Failed to remove item and delete order from backend:", error);
    }
  };

  const handleCreateOrder = async () => {
    console.log("Create Order clicked");
    createOrder();  // Create order via context method
    navigate('/my-orders'); // Navigate to My Orders page
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <img 
                    src={item.product?.imageUrl ? `http://localhost:5172${item.product.imageUrl}` : '/default-image.jpg'} 
                    alt={item.product?.name || 'Product Image'} 
                    width="100" 
                    className="cart-item-image"
                  />
                  <span className="cart-item-name">{item.product?.name || 'Unknown Product'}</span>
                  <span className="cart-item-price">Price: ${item.product?.price.toFixed(2)}</span>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => handleDecrease(item.id)}>-</button>
                  <span className="cart-item-quantity-number">{item.quantity}</span>
                  <button onClick={() => handleIncrease(item.id)}>+</button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="remove-button">Remove</button>
              </li>
            ))}
          </ul>

          {/* Create Order Button */}
          <div className="create-order-container">
            <button onClick={handleCreateOrder} className="create-order-button">
              Create Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
