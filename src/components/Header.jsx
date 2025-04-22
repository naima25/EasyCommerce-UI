import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useAppContext } from "../context/AppContext"; // Updated import


const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, getTotalItems } = useAppContext();
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

  return (
    <nav>
      <div className="logo">
        <Link
          to="/home"
          className={location.pathname === "/home" ? "active" : ""}
          onClick={closeMenu}
        >
          Easy Commerce
        </Link>
      </div>
      <ul className={`menu ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link
            to="/categories"
            className={location.pathname === "/our-products" ? "active" : ""}
            onClick={closeMenu}
          >
            Our Products
          </Link>
        </li>
        <li>
          <Link
            to="/About-Us"
            className={location.pathname === "/About-Us" ? "active" : ""}
            onClick={closeMenu}
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            to="/search"
            className={location.pathname === "/search" ? "active" : ""}
            onClick={closeMenu}
          >
            Search
          </Link>
        </li>
        <li>
          <Link
            to="/wishlist"
            className={location.pathname === "/wishlist" ? "active" : ""}
            onClick={closeMenu}
          >
            Wishlist
          </Link>
        </li>
        
        <li className="nav-cart-item">
        <Link
          to="/cart"
          className={`cart-link ${location.pathname === "/cart" ? "active" : ""}`}
          onClick={closeMenu}
        >
          <span className="cart-text">Cart</span>
          {getTotalItems() > 0 && (
            <span className="cart-counter">{getTotalItems()}</span>
          )}
        </Link>
      </li>


        {/* Conditional rendering for Account/Logout/Profile */}
        {isAuthenticated && (
          <>
            <li>
              <Link
                to="/profile"
                className={location.pathname === "/profile" ? "active" : ""}
                onClick={closeMenu}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="#"

                onClick={handleLogout} // Call logout and redirect to home
              >
                Logout
              </Link>
            </li>
          </>
        )}
        {!isAuthenticated && (
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