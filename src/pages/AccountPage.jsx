import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import '../styles/account.css'; // Correct path to the CSS file
/* 
  AccountPage Component:
  This component is responsible for rendering either the login or register form based on the user's interaction.
  It uses a state variable `isLogin` to toggle between the LoginPage and RegisterPage components.

  */
 
const AccountPage = () => {
  const [isLogin, setIsLogin] = useState(true);  // State to toggle between login and register

  // Toggles between login and register forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="account-page">
      {/* Conditional rendering: Login or Register */}
      <div className="account-form">
        {isLogin ? (
          <LoginPage />
        ) : (
          <RegisterPage />
        )}
      </div>
      {/* Toggle between Login and Register */}
      <div className="account-toggle-buttons">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleForm();
          }}
          className="toggle-link"
        >
          {isLogin
            ? "Not a customer yet? Join us!"
            : "Already have an account? Sign in"}
        </a>
      </div>
    </div>
  );
};

export default AccountPage;
