import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/OurProducts.css';

const OurProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    products: true
  });
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

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

    // Fetch all products
    axios.get('http://localhost:5172/api/product')
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(prev => ({ ...prev, products: false }));
      })
      .catch((err) => {
        setError(err.message);
        setLoading(prev => ({ ...prev, products: false }));
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId) {
      const filtered = products.filter(product =>
        product.productCategories?.some(pc => pc.categoryId === categoryId)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  if (loading.categories || loading.products) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="our-products-container">
      {/* Top Text for Categories */}
      <div className="categories-header">
        <span>Categories</span>
      </div>

      {/* Category Buttons Row */}
      <div className="category-row">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Display */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            {product.featured && <span className="featured-badge">Featured</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurProducts;
