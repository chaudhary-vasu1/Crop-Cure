import axios from 'axios';

const api = axios.create({
    // Use environment variable or default to local backend URL
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
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