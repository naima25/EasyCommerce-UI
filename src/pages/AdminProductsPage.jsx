import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/AdminProductspage.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5172/api/product'),
          axios.get('http://localhost:5172/api/category')
        ]);

        const productsWithCategories = productsRes.data.map(product => ({
          ...product,
          categoryName: product.categoryNames?.join(', ') || 'Uncategorized'
        }));

        setProducts(productsWithCategories);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await axios.delete(`http://localhost:5172/api/product/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-products-container">
      <h2>Products</h2>

      <div className="admin-controls">
        <Link to="/admin/categories" className="categories-link">
          Manage Categories
        </Link>
        <Link to="/admin/products/new" className="add-button">
          + Add New Product
        </Link>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th> {/* New column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="admin-product-thumbnail"
                />
              </td>
              <td>{product.name}</td>
              <td>EasyCommerce</td>
              <td>{product.categoryName}</td>
              <td>${product.price?.toFixed(2)}</td> {/* New price cell */}
              <td className="action-buttons">
                <Link 
                  to={`/admin/products/edit/${product.id}`} 
                  className="edit-button"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductsPage;
