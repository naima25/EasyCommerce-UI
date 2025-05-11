import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import '../styles/AdminProductsPage.css';

const AdminProductsPage = () => {
  const {products, deleteProduct, loading, error} = useAppContext()

  const handleDelete = async (productId) => {
    if (window.confirm('Delete this product permanently?')) {
      deleteProduct(productId);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-products-container">
      <h2>Products</h2>

      <div className="admin-controls">
        <Link to="/admin/categories" className="categories-link">
          Manage Categories
        </Link>
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
            <th>Price</th> {/* New column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
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
              <td>{product.categoryNames}</td>
              <td>${product.price?.toFixed(2)}</td> {/* New price cell */}
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
    </div>
  );
};

export default AdminProductsPage;
