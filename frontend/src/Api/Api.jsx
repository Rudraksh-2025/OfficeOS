import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./ApiClient";



// login
export const useLogin = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// Register
export const useRegister = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/auth/register', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// Forgot Password
export const useForgotPassword = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/auth/forgot-password', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};

// Verify Otp
export const useVerifyOtp = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/auth/verify-otp', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};

// Reset Password
export const useResetPassword = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/auth/reset-password', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};