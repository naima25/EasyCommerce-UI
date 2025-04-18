// src/services/api.config.js
import axios from 'axios';

// Set the base URL from environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5172/api/';

// Create an Axios instance with a default base URL and headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
