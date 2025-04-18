import React, { useState } from 'react';
import { loginUser } from '../services/AuthService';

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
