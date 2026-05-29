import axios from 'axios';

const api = axios.create({
    // Notice the /api added to the end!
    baseURL: 'https://crop-cure-backend-f2zf.onrender.com/api',
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;