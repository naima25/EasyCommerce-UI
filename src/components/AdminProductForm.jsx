import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AdminProductForm.css'; 

/*

  This component is used to add or edit products in the admin panel.
  - If there's an ID in the URL, it fetches product details and allows editing.
  - If not, it shows a blank form to create a new product.
  - It also fetches available categories to choose from in a dropdown.
  - After submitting, it saves the product and navigates back to the product list.
*/

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
  });

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5172/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (id) {
      setIsEditing(true);
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5172/api/product/${id}`);
          setProduct({
            ...response.data,
            category: response.data.categoryIds?.[0] || '', // Assume first category ID if multiple
          });
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
        await axios.put(`http://localhost:5172/api/product/${id}`, product);
        alert('Product updated!');
      } else {
        const createRes = await axios.post('http://localhost:5172/api/product', product);
        const newProductId = createRes.data.id;

        // Assign category
        if (product.category) {
          await axios.post('http://localhost:5172/api/productcategory', {
            productid: newProductId,
            categoryid: parseInt(product.category),
          });
        }

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
              <option key={category.id} value={category.id}>
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
