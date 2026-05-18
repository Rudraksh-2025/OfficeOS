// sockets/socketInstance.js
let io = null;

export const setIO = (instance) => {
    io = instance;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};