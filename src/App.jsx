import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import AppContect
import { useAppContext } from './context/AppContext';

// import element for route protection
import ProtectedRoute from './components/ProtectedRoute';

// Import components for general pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AccountPage from './pages/AccountPage';
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart';
import OurProducts from './pages/OurProducts';
import MyOrders from './pages/MyOrders';  

// Import components for admin pages
import AdminProductsPage from './pages/AdminProductsPage';  
import AdminCategoriesPage from './pages/AdminCategoriesPage';  
import AdminProductForm from './components/AdminProductForm'; // Corrected import for AdminProductForm
import AdminCategoryForm from './components/AdminCategoryForm'; // Import AdminCategoryForm for category creation/edit

import './App.css';

const App = () => {
  const { isAuthenticated } = useAppContext();

  return (
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/account" element={isAuthenticated ? <Navigate to="/our-products" replace /> : <AccountPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/our-products" element={<OurProducts />} />
              {/* A route for categories that redirects to the 'Our Products' page */}
              <Route path="/categories" element={<Navigate to="/our-products" replace />} />


              {/* Routes for authenticated users */}
              <Route path="/cart" element={<ProtectedRoute role="User" element={<Cart />} />} />
              <Route path="/my-orders" element={<ProtectedRoute role="User" element={<MyOrders />} />} />  

              {/* Admin Routes */}
              {/* Redirect to /admin/products by default when accessing /admin */}
              <Route path="/admin" element={<ProtectedRoute role="Admin" element={<Navigate to="/admin/products" replace />} />} />
              
              {/* Routes for Admin Products */}
              {/* Admin Products page: List all products */}
              <Route path="/admin/products" element={<ProtectedRoute role="Admin" element={<AdminProductsPage />} />} />
              
              {/* Add New Product */}
              <Route path="/admin/products/new" element={<ProtectedRoute role="Admin" element={<AdminProductForm />} />} />
              
              {/* Edit Product: Use product ID in URL */}
              <Route path="/admin/products/edit/:id" element={<ProtectedRoute role="Admin" element={<AdminProductForm />} />} />

              {/* Routes for Admin Categories */}
              {/* Admin Categories page: List all categories */}
              <Route path="/admin/categories" element={<ProtectedRoute role="Admin" element={<AdminCategoriesPage />} />} />
              
              {/* Add New Category */}
              <Route path="/admin/categories/new" element={<ProtectedRoute role="Admin" element={<AdminCategoryForm />} />} />
              
              {/* Edit Category: Use category ID in the URL */}
              <Route path="/admin/categories/edit/:id" element={<ProtectedRoute role="Admin" element={<AdminCategoryForm />} />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
