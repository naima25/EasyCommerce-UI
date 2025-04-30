import React from 'react';
import { useCart } from '../context/CartContext';  // Importing Cart Context
import { useNavigate } from 'react-router-dom';    // For navigation
import axios from 'axios';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
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
      // Remove item from cart first
      removeFromCart(itemId);

      // If the item is the last item in the cart, delete the order from the backend
      if (cartItems.length === 1) {
        // Assuming the backend expects the Order ID and Item details to be removed
        const orderId = cartItems[0].orderId;  // Ensure you have the orderId here

        // Send a request to backend to remove the order
        await axios.delete(`http://localhost:5172/api/order/${orderId}`);
        console.log("Order deleted successfully from backend");
        navigate('/');  // Navigate to a different page (e.g., homepage)
      }
    } catch (error) {
      console.error("Failed to remove item and delete order from backend:", error);
    }
  };

  const handleCreateOrder = async () => {
    console.log("Create Order clicked");
    const orderData = {
      Id: 1,
      OrderDate: new Date().toISOString().split('T')[0], // Current date
      TotalAmount: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
      CartItems: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    };

    try {
      // Create order via backend API
      const response = await axios.post('http://localhost:5172/api/order', orderData);
      console.log("Order created:", response.data);
      navigate('/my-orders'); // Navigate to My Orders page
    } catch (error) {
      console.error("Failed to create order:", error);
    }
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
