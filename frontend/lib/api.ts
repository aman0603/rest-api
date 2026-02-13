import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    // Debugging Logs
    console.log(`[API Request] Method: ${config.method?.toUpperCase()} | URL: ${config.baseURL}${config.url}`);
    console.log(`[API Request] Token exists in localStorage: ${!!token}`);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API Request] Attaching Authorization header: Bearer ${token.substring(0, 10)}...`);
    } else {
        console.warn('[API Request] No token found in localStorage!');
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('[API Error] Status:', error.response.status);
            console.error('[API Error] Data:', error.response.data);
            console.error('[API Error] Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('[API Error] No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('[API Error] Request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
