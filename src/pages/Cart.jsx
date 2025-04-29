import React from 'react';
import { useCart } from '../context/CartContext';  // Importing Cart Context

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleIncrease = (itemId) => {
    console.log("Increase clicked for item:", itemId);
    updateQuantity(itemId, 1);
  };
  
  const handleDecrease = (itemId) => {
    console.log("Decrease clicked for item:", itemId);
    updateQuantity(itemId, -1);
  };
  
  const handleRemove = (itemId) => {
    console.log("Remove clicked for item:", itemId);
    removeFromCart(itemId);
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
                  {/* Product Image */}
                  <img 
                    src={item.product?.imageUrl ? `http://localhost:5172${item.product.imageUrl}` : '/default-image.jpg'} 
                    alt={item.product?.name || 'Product Image'} 
                    width="100" 
                    className="cart-item-image"
                  />
                  {/* Product Name */}
                  <span className="cart-item-name">{item.product?.name || 'Unknown Product'}</span>
                  {/* Product Price */}
                  <span className="cart-item-price">Price: ${item.product?.price.toFixed(2)}</span>
                </div>
                <div className="cart-item-quantity">
                  {/* Decrease button */}
                  <button onClick={() => handleDecrease(item.id)}>-</button>
                  
                  {/* Quantity Display */}
                  <span className="cart-item-quantity-number">{item.quantity}</span>  {/* This should display the quantity */}
                  
                  {/* Increase button */}
                  <button onClick={() => handleIncrease(item.id)}>+</button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="remove-button">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CartPage;