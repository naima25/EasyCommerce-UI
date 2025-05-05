import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // 🛒 Import the cart context
import { useAppContext } from '../context/AppContext';
import '../styles/productcard.css';


const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext(); // 🛒 Get addToCart from context
  const { name, price, imageUrl, id } = product;
  
  const [quantity, setQuantity] = useState(1); 

  const handleAddToCart = () => {
    addToCart({ ...product, quantity }); // 🛒 
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
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>

        <div className="quantity-buttons">
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
