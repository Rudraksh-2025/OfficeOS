import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASEURL,
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    error => {
        const { response } = error;

        if (response && response.status === 400) {
            const errorMessage = response.data.message || response.data || '';
            // if (errorMessage?.toLowerCase().includes('account is already logged in on another device.')) {
            //     console.error('User logged in on another device');
            //     localStorage.removeItem("token");
            //     localStorage.removeItem("refreshToken");
            //     window.location.href = "/";
            // }
        }
        else if (
            error.response &&
            error.response.data &&
            error.response.data.message === "Invalid token"
        ) {
            // Clear auth data
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            // Redirect to login page only if not already there
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default apiClient;
