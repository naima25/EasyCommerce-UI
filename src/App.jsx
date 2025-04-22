import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

// Import components
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import AccountPage from './pages/AccountPage'
import AboutUs from './pages/AboutUs'
import OurProducts from './pages/OurProducts'
import './App.css'

const App = () => {
  return (
    <AppProvider>
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
              
              {/* Redirect for old links */}
              <Route path="/categories" element={<Navigate to="/our-products" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App