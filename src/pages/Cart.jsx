import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/Cart.css'; 


const CartPage = () => {
  const { cart, loading, error, addToCart, removeFromCart, updateCartItemQuantity } = useAppContext();
  console.log('Cart Items:', cart);
  // const cart  = cartItems[0];

  if (loading) return <div>Loading your cart...</div>;
  if (error) return <div>Error: {error}</div>;

  // const cartItems = cart?.cartItems || [];

  const handleRemoveClick = async (cartItemId) => {
    const success = await removeFromCart(cartItemId);
    if (success) {
      console.log(`Item with ID ${cartItemId} removed successfully.`);
    } else {
      console.log(`Failed to remove item with ID ${cartItemId}`);
    }
  };
  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
  
      {cart?.cartItems?.length > 0 ? (
        <div>
          {cart.cartItems.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="cart-item">
              <img
                src={item.product?.imageUrl || 'placeholder-image-url'}
                alt={item.product?.name || 'Product'}
              />
              <div className="cart-item-details">
                <h3>{item.product?.name || 'Unknown Product'}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.product?.price?.toFixed(2) || '0.00'}</p>
                <button
                  onClick={() => handleRemoveClick(item.productId)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3 className="cart-total">Total: ${cart?.price?.toFixed(2) || '0.00'}</h3>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  )
}

export default CartPage;