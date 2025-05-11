import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AdminProductForm.css'; 

/*

  This component is used to add/edit products in the admin panel.
  - If there's an ID in the URL, it fetches product details and allows editing.
  - If not, it shows a blank form to create a new product.
  - It also fetches available categories to choose from in a dropdown.
  - After submitting, it saves the product and navigates back to the product list.
*/

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {categories,getProductById,updateOrCreateProduct } = useAppContext(); 


  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
  });

  const [isEditing, setIsEditing] = useState(false);


useEffect(() => {
  let isMounted = true; // Flag to track component mount status

  const fetchProduct = async () => {
    if (id) {
      setIsEditing(true);
      try {
        const productData = await getProductById(id);
        if (isMounted) { // Only update state if component is still mounted
          setProduct(productData);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        // Handle error (e.g., show error message)
      }
    } else {
      setIsEditing(false);
    }
  };

  fetchProduct();

  return () => {
    isMounted = false; // Cleanup function to prevent state updates after unmount
  };
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      updateOrCreateProduct(isEditing, id, product)
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
