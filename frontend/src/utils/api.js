import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (import.meta.env.REACT_APP_BACKEND_URL) {
        return `${import.meta.env.REACT_APP_BACKEND_URL}/api`;
    }
    
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    /^192\.168\./.test(hostname) || 
                    /^10\./.test(hostname) || 
                    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);
                    
    if (isLocal) {
        // Use the current IP address but point to backend port 5000
        return `http://${hostname}:5000/api`;
    }
    
    // Default production Render URL fallback
    return 'https://crop-cure-backend-f2zf.onrender.com/api';
};

const api = axios.create({
    baseURL: getBaseURL()
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