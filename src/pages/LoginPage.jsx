import React, { useState } from 'react';
import { loginUser } from '../services/AuthService';
  /* 
LoginPage Component:
This component allows users to log into the application by providing their email and password.
It communicates with the authentication service (`AuthService`) to validate the credentials and retrieve a token for successful login.

Key Features:
  1. **Email and Password Inputs**: The form includes two inputs for email and password. The input fields are controlled via React's `useState`.
  2. **Login Handling**: Upon form submission, the `handleLogin` function is invoked, which makes an asynchronous call to the `loginUser` function (from `AuthService`) to authenticate the user.
  3. **Token Storage**: If login is successful, the returned token is stored in `localStorage` for session persistence, and the user is informed that the login was successful.
  4. **Error Handling**: If an error occurs during the login process (e.g., invalid credentials or no token received), an error message is displayed to the user.
  5. **Success Message**: If login is successful, a success message is displayed to inform the user of successful login.

The component uses controlled components for handling form data and updates the UI to reflect success or error states based on the result of the login attempt.
*/

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await loginUser(email, password);

      if (response.token) {
        localStorage.setItem('token', response.token); 
        setSuccess('Login successful!');
        console.log('Logged in with token:', response.token);
      } else {
        setError('No token received.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default LoginPage;