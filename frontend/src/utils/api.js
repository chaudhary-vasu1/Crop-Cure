import axios from 'axios';

const api = axios.create({
    // Make sure this points to your Render backend!
    baseURL: 'https://crop-cure-backend-f2zf.onrender.com/api' 
});

// 👇 ADD THIS INTERCEPTOR 👇
api.interceptors.request.use(
    (config) => {
        // Look in local storage for the token
        const token = localStorage.getItem('token');
        
        // If we have a token, attach it to the Authorization header
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