// AdminCategoryForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link and useNavigate
import '../styles/AdminProductForm.css';
import '../styles/AdminCategoryForm.css';

const AdminCategoryForm = () => {
  /*
    Get the category ID from the URL (if we're editing an existing category).
    Also set up a tool (navigate) to move to a different page after saving.
  */
  const { id } = useParams(); 
  const navigate = useNavigate();

    /*
    Set up the form's starting values.
    Right now, we only have one field: name.
    Also track whether we're editing an existing category or adding a new one.
  */

  const [category, setCategory] = useState({
    name: '',
  });
  const [isEditing, setIsEditing] = useState(false);

    /*
    When the page loads, check if there's a category ID.
    If there is, we're editing, so go get the category info from the server.
  */

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

    /*
    Update the form whenever the user types something.
    This keeps track of what they type into the input box.
  */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

    /*
    When the user submits the form:
    - If editing, update the existing category.
    - If adding, create a new one.
    Then show a message and go back to the categories list.
  */
 
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
