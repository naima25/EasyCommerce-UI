import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from '../assets/EasyCommerce-icon.svg';
import { useAppContext } from "../context/AppContext"; 
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { cart, isAuthenticated, logout, getTotalItems, userRole } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const totalCartQuantity = cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  console.log(logo)
  return (
    <nav>
      <div className="logo">
        <Link
          to="/home"
          className={`header-logo-link ${location.pathname === '/home' ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <img src={logo} alt="Easy Commerce logo" className="header-logo" />
          <span className="header-logo-text"><span className="header-logo-text-easy">Easy</span>Commerce</span>
        </Link>
      </div>
      <ul className={`menu ${isMenuOpen ? "active" : ""}`}>
        {/* Public Links - visible to everyone */}
        <li>
          <Link
            to="/our-products"
            className={location.pathname === "/our-products" ? "active" : ""}
            onClick={closeMenu}
          >
            Our Products
          </Link>
        </li>
        <li>
          <Link
            to="/about-us"
            className={location.pathname === "/about-us" ? "active" : ""}
            onClick={closeMenu}
          >
            About Us
          </Link>
        </li>

        {/* User-specific Links - only visible to authenticated users with 'user' role */}
        {isAuthenticated && userRole === "User" && (
          <>
            <li>
              <Link
                to="/my-orders"
                className={location.pathname === "/my-orders" ? "active" : ""}
                onClick={closeMenu}
              >
                My Orders
              </Link>
            </li>
            <li className="nav-cart-item">
              <Link
                to="/cart"
                className={`cart-link ${location.pathname === "/cart" ? "active" : ""}`}
                onClick={closeMenu}
              >
                <span className="cart-text">
                  Cart <FaShoppingCart className="cart-icon" style={{ marginLeft: "5px" }} />
                  {totalCartQuantity > 0 && <span className="cart-counter">({totalCartQuantity})</span>}
                </span>
              </Link>
            </li>
          </>
        )}

        {/* Admin-specific Links - only visible to authenticated users with 'admin' role */}
        {isAuthenticated && userRole === "Admin" && (
          <li>
            <Link
              to="/admin/products"  
              className={location.pathname.startsWith("/admin") ? "active" : ""}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          </li>
        )}

        {/* Auth Links - conditionally shown based on authentication status */}
        {isAuthenticated ? (
          <li>
            <Link to="#" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        ) : (
          <li>
            <Link
              to="/account"
              className={location.pathname === "/account" ? "active" : ""}
              onClick={closeMenu}
            >
              Account
            </Link>
          </li>
        )}
      </ul>

      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
    </nav>
  );
};

export default Header;