import axios from 'axios';

const api = axios.create({
    // Ensure this matches your live backend URL
    baseURL: 'https://crop-cure-backend-f2zf.onrender.com/api' 
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