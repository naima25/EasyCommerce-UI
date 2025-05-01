import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';  // Corrected import for CartProvider

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AccountPage from './pages/AccountPage';
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart';
import OurProducts from './pages/OurProducts';
import MyOrders from './pages/MyOrders';  
import AdminProductsPage from './pages/AdminProductsPage';  
import AdminCategoriesPage from './pages/AdminCategoriesPage';  
import AdminProductForm from './components/AdminProductForm'; // Corrected import for AdminProductForm

import './App.css';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/our-products" element={<OurProducts />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-orders" element={<MyOrders />} />  
              <Route path="/categories" element={<Navigate to="/our-products" replace />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />  {/* Route to Add New Product */}
              <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />  {/* Route to Edit Product */}
              <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
