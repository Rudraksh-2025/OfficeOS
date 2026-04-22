import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (!socket) {
        const token = localStorage.getItem('token');
        let baseUrl = import.meta.env.VITE_BASEURL || "http://localhost:3003";
        if (baseUrl.endsWith('/api')) {
            baseUrl = baseUrl.slice(0, -4);
        }
        socket = io(baseUrl, {
            auth: { token }
        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocket();
    }
    return socket;
};

export const joinChannel = (channelId) => {
    const s = getSocket();
    s.emit("join_channel", channelId);
};

export const leaveChannel = (channelId) => {
    const s = getSocket();
    s.emit("leave_channel", channelId);
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
