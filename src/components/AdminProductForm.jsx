import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AdminProductForm.css'; 

const AdminProductForm = () => {
  const { id } = useParams();  // Grab product ID for editing (if any)
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Check if we're editing an existing product
  
  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5172/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    // If we have an ID in the URL, we are editing a product
    if (id) {
      setIsEditing(true);
      // Fetch the product data for editing
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5172/api/product/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Failed to fetch product:', error);
        }
      };
      fetchProduct();
    } else {
      setIsEditing(false);
    }

    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update the product if editing
        await axios.put(`http://localhost:5172/api/product/${id}`, product);
        alert('Product updated!');
      } else {
        // Create a new product if adding
        await axios.post('http://localhost:5172/api/product', product);
        alert('Product added!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
      </form>
    </div>
  );
};

export default AdminProductForm;
