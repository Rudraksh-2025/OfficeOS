import Message from "../models/message.model.js";

export const createMessageService = async ({
    channelId,
    senderId,
    conversationId,
    content,
}) => {
    const message = await Message.create({
        channelId: channelId || null,
        conversationId: conversationId || null,
        senderId,
        content,
    });

    return message;
};

export const getMessagesService = async ({ channelId, page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;

    const messages = await Message.find({ channelId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("senderId", "name email");

    return messages.reverse();
};

export const markAsReadService = async ({ messageId, userId }) => {
    const message = await Message.findById(messageId);

    if (!message) throw new Error("Message not found");

    const alreadyRead = message.readBy.some(
        (r) => r.userId.toString() === userId
    );

    if (!alreadyRead) {
        message.readBy.push({ userId });
        await message.save();
    }

    return message;
};