import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';


/*
  ProductCard.jsx

  This component displays a single product's information:
  - It shows the product image, name, and price.
  - Users can increase or decrease the quantity.
  - Clicking "Add to Cart" adds the product (with selected quantity) to the cart.
*/

const ProductCard = ({ product }) => {
  const { addToCart, isAuthenticated, userRole } = useAppContext(); // 🛒 Get addToCart from context
  const { name, price, imageUrl, id } = product;
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1); 

const handleAddToCart = () => {
  if (!isAuthenticated) {
    navigate('/account');
    return;
  }
  addToCart({ ...product, quantity }); 
  setQuantity(1);
};

  

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="product-card" key={id}>
      <img 
        src={imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5172${imageUrl}`} 
        alt={name} 
        className="product-image" 
      />
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>

      <div className="add-to-cart-container">
        <button 
          className="add-to-cart-button" 
          onClick={handleAddToCart} 
          disabled={userRole === "Admin"}
        >
          Add to Cart
        </button>

        {userRole === "Admin" ? <></> : <div className="quantity-buttons">
          <button onClick={handleDecrease} disabled={userRole === "Admin"}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease} disabled={userRole === "Admin"}>+</button>
        </div> }
      </div>
    </div>
  );
};

export default ProductCard;
