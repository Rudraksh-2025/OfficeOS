import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./ApiClient";

// add channel
export const useAddChannel = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            // data:{"type":"PUBLIC",
            // "name": "Channel one"}
            const response = await apiClient.post('/channel', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// get channel
export const useGetChannel = () => {
    return useQuery({
        queryKey: ['getChanel'],
        queryFn: async () => {
            const { data } = await apiClient.get(`/channel`);
            return data;
        },
        staleTime: Infinity,
        placeholderData: keepPreviousData,
    });
};
// join Chanel
export const useJoinChannel = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (channelId) => {
            const response = await apiClient.post(`/channel/${channelId}/join`);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// add member 
export const useAddMember = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async ({ channelId, userId }) => {
            const response = await apiClient.post(`/channel/${channelId}/add-member`, { userId });
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// create dm
export const useCreateDm = (onSuccess, onError) => {
    return useMutation({
        //   data={"userId":"23"}
        mutationFn: async (data) => {
            const response = await apiClient.post(`/conversation/dm`, data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// create group
export const useCreateGroup = (onSuccess, onError) => {
    return useMutation({
        //   data={
        //         "name": "Bro code",
        //         "members": [123, 23, 23]
        //     }
        mutationFn: async (data) => {
            const response = await apiClient.post(`/conversation/group`, data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
// get conversation
export const useGetConversation = () => {
    return useQuery({
        queryKey: ['getConversation'],
        queryFn: async () => {
            const { data } = await apiClient.get(`/conversation`);
            return data;
        },
        staleTime: Infinity,
        placeholderData: keepPreviousData,
    });
};

// get messages
export const useGetMessages = (channelId) => {
    return useQuery({
        queryKey: ['getMessages', channelId],
        queryFn: async () => {
            if (!channelId) return [];
            const { data } = await apiClient.get(`/messages/${channelId}`);
            return data;
        },
        enabled: !!channelId,
    });
};

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

// Social Login
export const useSocialLogin = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/auth/social-login', data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};