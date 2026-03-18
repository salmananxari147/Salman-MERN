import axios from 'axios';
import useAuthStore from '../store/authStore';

// Create an Axios instance
const api = axios.create({
    baseURL: '/api', // Using Vite proxy or relative path if deployed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        // Get token from auth store (zustand directly exposes getState())
        const state = useAuthStore.getState();
        const token = state.userInfo?.token;

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
