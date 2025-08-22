import axios from 'axios';

// Create a single API instance
const API = axios.create({
  baseURL: "https://auto-trust-version2-0.onrender.com/api", // <-- Corrected URL with /api prefix
  withCredentials: true,
});

// Add token to every request if it exists
API.interceptors.request.use((config) => { // <-- Use 'API' here
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API; // <-- Export 'API'