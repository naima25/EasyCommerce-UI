import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/AdminProductsPage.css'; // Reuse CSS file

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5172/api/category');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories: ' + err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    if (window.confirm('Delete this category permanently?')) {
      try {
        await axios.delete(`http://localhost:5172/api/category/${categoryId}`);
        setCategories(categories.filter((c) => c.id !== categoryId));
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-products-container">
      <h2>Categories</h2>

      <div className="admin-controls">
        <Link to="/admin/categories/new" className="add-button">
          + Add New Category
        </Link>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td className="action-buttons">
                <Link to={`/admin/categories/edit/${category.id}`} className="edit-button">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back to Products Button */}
      <div className="navigation-buttons">
        <Link to="/admin/products" className="back-to-products-button">
          Back to Products Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
