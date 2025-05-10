import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

/*
  RegisterPage component:
  - Provides a form for users to register with an email and password.
  - Handles the form submission by calling the `registerUser` service function.
  - Displays success or error messages based on the registration outcome.
*/


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const {error, register} = useAppContext()

  const handleRegister = async (event) => {
    event.preventDefault();
    setSuccess('');

    try {
      await register(email, password);
      setSuccess('Registration successful!');
      navigate('/our-products');
    } catch (err) {
      console.log("Registration error: ", err)
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
