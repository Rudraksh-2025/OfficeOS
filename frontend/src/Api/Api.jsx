import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./ApiClient";



// login
export const useLogin = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await apiClient.post('/users/login', credentials);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// Register admin
export const useCreateAdmin = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/users/signup', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// Send Email Verificaiton otp
export const useSendOtp = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/otp/generate', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// Verify Email Verificaiton otp
export const useOtpRegister = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/otp/verify', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};