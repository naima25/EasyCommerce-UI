import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext' // Updated import

// Import necessary components
import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import AccountPage from './pages/AccountPage'  // Import AccountPage (handles login and register)

import './App.css'

const App = () => {
  return (
    <AppProvider> {/* Replaced AuthProvider with AppProvider */}
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/home" element={<Home />} /> {/* Home route */}
              <Route path="/account" element={<AccountPage />} /> {/* Account route for login/register */}
              
              {/* Other routes can be commented out for now */}
              {/* <Route path="/about-us" element={<AboutUs />} /> */}
              {/* <Route path="/categories" element={<Categories />} /> */}
              {/* <Route path="/product/:id" element={<ProductDetails />} /> */}
              {/* <Route path="/search" element={<Search />} /> */}

              {/* Protected Routes (Optional, if you have them in future) */}
              {/* <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} /> */}
              {/* <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
