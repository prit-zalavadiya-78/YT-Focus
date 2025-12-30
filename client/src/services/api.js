import axios from 'axios';

// 1. Determine the Base URL dynamically
// Vercel will provide VITE_API_URL; Localhost will fall back to port 5000
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Create the Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. ✅ THE FIX: Request Interceptor
// This runs before every single API call (Goals, Profile, YouTube, etc.)
api.interceptors.request.use(
  (config) => {
    // Grab the token from local storage
    const token = localStorage.getItem('token');
    
    // If a token exists, attach it to the header so the backend knows who you are
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;