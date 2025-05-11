import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';  
import { useAppContext } from '../context/AppContext';
import '../styles/OurProducts.css';  

/*
  OurProducts component:
  - Displays a list of product categories with the option to filter products by category.
  - Includes a "View All Products" button to reset the filter and show all products.
  - Handles category selection and updates the display of filtered products accordingly.
*/


const OurProducts = () => {
  const {categories, products, filteredProducts, setFilteredProducts, loading, error, getProductsByCategory} = useAppContext(); 
  const [activeCategory, setActiveCategory] = useState(null); // State for active category
  
  // Function to shuffle products randomly
    const shuffleArray = (array) => {
      return array.sort(() => Math.random() - 0.5); // Shuffle using random number generator
    };

  // useEffect to fetch products when the component mounts
  useEffect(() => {
    // Set the filtered products to the shuffled array
    setFilteredProducts(products);
  }, [loading]);


  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  
    // Fetch products based on the encoded category name
    if (categoryName) {
      getProductsByCategory(categoryName)
    }
  };
  

  // Handle "View All Products" button click
  const viewAllProducts = () => {
    setActiveCategory(null); // Reset active category
    setFilteredProducts(products); // Reset to show all products
  };

  // Render loading or error messages if needed
  // if (loading.categories || loading.products) return <div>Loading...</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="our-products-container">
      {/* "View Our Products" Button */}
      <div className="categories-header">
        <button onClick={viewAllProducts}>View Our Products</button>
      </div>

      {/* Category Buttons Row */}
      <div className="category-row">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${activeCategory === category.name ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Display */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} /> 
        ))}
      </div>
    </div>
  );
};

export default OurProducts;