import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const CartPage = () => {
  const { cartItems, loading, error, addToCart, removeFromCart, updateCartItemQuantity } = useAppContext();
  console.log('Cart Items:', cartItems);
  // const cart  = cartItems[0];

  // useEffect(() => {
  //   if (!cart) { // Only fetch if there's no cart data
  //     fetchCart(); // Refresh cart when component mounts
  //   }
  // }, [cart, fetchCart]); // Only run once when cart is not loaded

  // useEffect(() => {
  //   if (cart) {
  //     console.log('Cart loaded:', cart);
  //   }
  // }, [cart]);

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
    <div>
      <h1>Your Cart</h1>
      <br />

      {cartItems[0].cartItems.length > 0 ? (
        <div>
          {cartItems[0].cartItems.map((item, index) => (
            <div key={`${item.productId}-${index}`}>
              <img
                src={item.product?.imageUrl || 'placeholder-image-url'}
                alt={item.product?.name || 'Product'}
                width="100"
              />
              <h3>{item.product?.name || 'Unknown Product'}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.product?.price?.toFixed(2) || '0.00'}</p>
              <button
                onClick={() => handleRemoveClick(item.productId)}
                style={{ marginTop: '10px' }}
              >
                Remove
              </button>
              <hr />
            </div>
          ))}
          <h3>Total: ${cartItems[0].cartItems?.price?.toFixed(2) || '0.00'}</h3>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
