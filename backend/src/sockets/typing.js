const typingUsers = new Map(); // channelId → Set(userId)

export const startTyping = (channelId, userId) => {
    if (!typingUsers.has(channelId)) {
        typingUsers.set(channelId, new Set());
    }
    typingUsers.get(channelId).add(userId);
};

export const stopTyping = (channelId, userId) => {
    if (!typingUsers.has(channelId)) return;

    typingUsers.get(channelId).delete(userId);
};