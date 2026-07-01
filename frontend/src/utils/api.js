import axios from 'axios';

const api = axios.create({
    // Dynamically switch between localhost for local dev and live Render backend for mobile/Vercel
    baseURL: import.meta.env.VITE_API_URL || 
             (import.meta.env.REACT_APP_BACKEND_URL ? `${import.meta.env.REACT_APP_BACKEND_URL}/api` : 
              (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                  ? 'http://localhost:5000/api'
                  : 'https://crop-cure-backend-f2zf.onrender.com/api'))
});

// Interceptor to attach the token to every request automatically
api.interceptors.request.use(
    (config) => {
        // Read the token from localStorage (set by AuthContext after login/OTP verify)
        const token = localStorage.getItem('token');
        
        // If the token exists, attach it to the Authorization header
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