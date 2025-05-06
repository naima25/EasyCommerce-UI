import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/AdminProductspage.css';

/* 
  AdminCategoriesPage Component:
  This component is designed for the admin interface to manage product categories. It allows the admin to view, add, edit, and delete categories.

  Key Features:
    1. **Fetch Categories**: The component fetches a list of categories from the backend API when it mounts, using the `axios` library. It stores the data in the `categories` state.
    2. **Loading and Error Handling**: The component handles loading and error states using `loading` and `error` states. A loading message is displayed until the categories are fetched, and an error message is shown if the fetch fails.
    3. **Add New Category**: A button at the top of the page allows the admin to navigate to a page for adding a new category (`/admin/categories/new`).
    4. **Delete Category**: Each category has a delete button that allows the admin to remove a category from the system. This triggers a confirmation prompt before deleting.
    5. **Edit Category**: Each category also has an edit button that takes the admin to the category edit page (`/admin/categories/edit/:id`).
    6. **Navigation**: There is a button to navigate back to the products dashboard.
*/

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
