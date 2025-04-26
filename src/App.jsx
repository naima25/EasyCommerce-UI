import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';  // Import the CartProvider from context

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AccountPage from './pages/AccountPage';
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart';
import OurProducts from './pages/OurProducts';
import './App.css';

const App = () => {
  return (
    <CartProvider> {/* Wrap the app in CartProvider to give access to the cart context */}
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

              {/* Redirect for old links */}
              <Route path="/categories" element={<Navigate to="/our-products" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>  
  );
}

export default App;
