import axios from 'axios';

const api = axios.create({
    // Replace with your production URL later
    baseURL: 'http://localhost:5000/api',
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