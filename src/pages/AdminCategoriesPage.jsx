import React, { useState, useEffect } from 'react';
import {useAppContext} from '../context/AppContext'
import { Link } from 'react-router-dom';
import '../styles/AdminProductsPage.css';

/* 
  AdminCategoriesPage Component:
  This component is designed for the admin interface to manage product categories. It allows the admin to view, add, edit, and delete categories.

  Key Features:
  **Add New Category**: A button at the top of the page allows the admin to navigate to a page for adding a new category (`/admin/categories/new`).
   **Delete Category**: Each category has a delete button that allows the admin to remove a category from the system. This triggers a confirmation prompt before deleting.
  **Edit Category**: Each category also has an edit button that takes the admin to the category edit page (`/admin/categories/edit/:id`).
*/

const AdminCategoriesPage = () => {
  const {categories, loading, error, deleteCategory,fetchCategory} = useAppContext();

  const handleDelete = async (categoryId) => {
    if (window.confirm('Delete this category permanently?')) {
      deleteCategory(categoryId)
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
