import React from 'react';
import '../styles/productcard.css';  

const ProductCard = ({ product }) => {
  const { name, price, imageUrl } = product;

  const handleAddToCart = () => {
    // Add logic to handle adding to the cart (you can expand this later)
    console.log(`Added ${name} to cart`);
  };

  return (
    <div className="product-card">
      <img 
        src={imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5172${imageUrl}`} 
        alt={name} 
        className="product-image" 
      />
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>

      {/* Add to Cart button */}
      <div className="add-to-cart-container">
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <div className="quantity-buttons">
          <button>-</button>
          <span>1</span>
          <button>+</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
