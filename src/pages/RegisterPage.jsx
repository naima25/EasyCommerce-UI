import React, { useState } from 'react';
import { registerUser } from '../services/AuthService';

/*
  RegisterPage component:
  - Provides a form for users to register with an email and password.
  - Handles the form submission by calling the `registerUser` service function.
  - Displays success or error messages based on the registration outcome.
*/


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await registerUser(email, password);
      setSuccess('Registration successful! Check your email for verification.');
      console.log('Registration response:', response);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
