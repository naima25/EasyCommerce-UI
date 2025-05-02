// AdminCategoryForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link and useNavigate
import '../styles/AdminProductForm.css';
import '../styles/AdminCategoryForm.css';

const AdminCategoryForm = () => {
  const { id } = useParams(); // Get category ID from URL if we're editing
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If we have a category ID, fetch the category data for editing
    if (id) {
      setIsEditing(true);
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`http://localhost:5172/api/category/${id}`);
          setCategory(response.data);
        } catch (err) {
          console.error('Failed to fetch category:', err);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update category if editing
        await axios.put(`http://localhost:5172/api/category/${id}`, category);
        alert('Category updated!');
      } else {
        // Create new category if not editing
        await axios.post('http://localhost:5172/api/category', category);
        alert('Category added!');
      }
      navigate('/admin/categories'); // After submission, navigate to categories page
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="admin-category-form-container">
      <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isEditing ? 'Update Category' : 'Add Category'}</button>
      </form>

      {/* Back to Categories Button */}
      <div className="navigation-buttons">
        <Link to="/admin/categories" className="back-to-categories-button">
          Back to Categories
        </Link>
      </div>
    </div>
  );
};

export default AdminCategoryForm;
