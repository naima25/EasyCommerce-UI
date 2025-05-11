// AdminCategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link and useNavigate
import { useAppContext } from '../context/AppContext';
import '../styles/AdminProductForm.css';
import '../styles/AdminCategoryForm.css';

const AdminCategoryForm = () => {

  const { id } = useParams(); 
  const navigate = useNavigate();

   

  const [category, setCategory] = useState({
    name: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const {updateOrCreateCategory, getCategoryById} = useAppContext();


  useEffect(() => {
  let isMounted = true; // Flag to track component mount status

  const fetchCategory = async () => {
    if (id) {
      setIsEditing(true);
      try {
        const categoryData = await getCategoryById(id);
        if (isMounted) { // Only update state if component is still mounted
          setCategory(categoryData);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
        // Handle error (e.g., show error message)
      }
    } else {
      setIsEditing(false);
    }
  };

  fetchCategory();

  return () => {
    isMounted = false; // Cleanup function to prevent state updates after unmount
  };
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateOrCreateCategory(isEditing, id, category)
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
