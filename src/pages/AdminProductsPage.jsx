import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/AdminProductsPage.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Adjust this number to how many products you want to show per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5172/api/product'),
          axios.get('http://localhost:5172/api/category')
        ]);

        // Map category names from the response directly
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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePagination = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-products-container">
      <h2>Products</h2>

      <div className="admin-controls">
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
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

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => handlePagination(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index} 
            onClick={() => handlePagination(index + 1)} 
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button 
          onClick={() => handlePagination(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminProductsPage;
