import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Ensure the correct import

// Create an axios instance with a default base URL and Content-Type
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,  // The base URL for your API
  headers: { "Content-Type": "application/json" }  // Default header for JSON requests
});

// Helper function to check if the token is valid
const isTokenValid = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();  // Token is valid if not expired
  } catch (error) {
    return false;
  }
};

// Automatically attach JWT token from localStorage to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {  // Only attach token if it's valid
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;  // Return modified config for the request
  },
  (error) => Promise.reject(error)  // Reject the request in case of error
);

export default api;