import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';  
import '../styles/OurProducts.css';  

const OurProducts = () => {
  const [categories, setCategories] = useState([]); // State for categories
  const [products, setProducts] = useState([]); // State for all products
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [loading, setLoading] = useState({
    categories: true,
    products: true,
  });
  const [error, setError] = useState(null); // State for error handling
  const [activeCategory, setActiveCategory] = useState(null); // State for active category

    // Function to shuffle products randomly
    const shuffleArray = (array) => {
      return array.sort(() => Math.random() - 0.5); // Shuffle using random number generator
    };

  // Fetch categories and products on component mount
  useEffect(() => {
    // Fetch categories
    axios.get('http://localhost:5172/api/category')
      .then((response) => {
        setCategories(response.data);
        setLoading(prev => ({ ...prev, categories: false }));
      })
      .catch((err) => {
        setError(err.message);
        setLoading(prev => ({ ...prev, categories: false }));
      });

    // Fetch all products initially
    axios.get('http://localhost:5172/api/product')
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initially, display all products
        setLoading(prev => ({ ...prev, products: false }));
      })
      .catch((err) => {
        setError(err.message);
        setLoading(prev => ({ ...prev, products: false }));
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  
    // Fetch products based on the encoded category name
    if (categoryName) {
      axios.get(`http://localhost:5172/api/Product/byCategory?categoryName=${encodeURIComponent(categoryName)}`)
        .then((response) => {
          setFilteredProducts(response.data); // Set filtered products based on category
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };
  

  // Handle "View All Products" button click
  const viewAllProducts = () => {
    setActiveCategory(null); // Reset active category
    setFilteredProducts(products); // Reset to show all products
  };

  // Render loading or error messages if needed
  if (loading.categories || loading.products) return <div>Loading...</div>;
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