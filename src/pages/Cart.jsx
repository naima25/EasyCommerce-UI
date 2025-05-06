import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/Cart.css'; 

/* 
  CartPage Component:
  This component displays the shopping cart page for the user. It allows the user to view the items in their cart, remove items, 
  and see the total price of the cart.

  Key Features:
    1. **Loading and Error Handling**: The component shows a loading message while fetching the cart data and an error message if there’s an issue.
    2. **Display Cart Items**: It maps through the items in the cart and displays each product's name, quantity, and price. A placeholder image is shown if no image URL is available.
    3. **Remove Item**: Each item has a "Remove" button that allows the user to remove it from the cart by calling the `removeFromCart` function from the AppContext.
    4. **Cart Total**: The total price of the items in the cart is displayed at the bottom. It calculates the total based on the prices of the items.
    5. **Empty Cart**: If the cart is empty, a message is shown indicating that the cart is empty.

  The component uses `useAppContext` to access the cart data and actions such as adding, removing, and updating cart items.
*/

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