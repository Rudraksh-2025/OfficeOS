import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createMessageService } from "../services/message.service.js";
import {
    addUser,
    removeUser,
    getOnlineUsers,
} from "./presense.js";
import conversationModel from "../models/conversation.model.js";
import channelModel from "../models/channel.model.js";

import {
    startTyping,
    stopTyping,
} from "./typing.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    // 🔐 Auth middleware for socket
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.user.userId);

        const userId = socket.user.userId;

        addUser(userId, socket.id);

        io.emit("presence_update", getOnlineUsers());

        // Send message
        socket.on("send_message", async (data) => {
            try {
                const { channelId, content, tempId } = data;

                // Save first
                const message = await createMessageService({
                    channelId,
                    senderId: socket.user.userId,
                    content,
                });

                const populatedMessage = await message.populate("senderId", "name email");

                // Emit to channel
                io.to(channelId).emit("receive_message", { ...populatedMessage.toJSON(), tempId });

            } catch (err) {
                socket.emit("error", err.message);
            }
        });

        socket.on("join_conversation", (conversationId) => {
            socket.join(conversationId);
        });

        socket.on("join_channel", async (channelId) => {
            let channel = await channelModel.findById(channelId);

            if (!channel) {
                // Check if it's a conversation
                const convo = await conversationModel.findById(channelId);
                if (!convo) return;
                
                if (!convo.members.some(id => id.toString() === userId)) {
                    return socket.emit("error", "Not a member of conversation");
                }
                return socket.join(channelId);
            }

            // 🔥 KEY FIX
            if (channel.type === "PRIVATE") {
                if (!channel.memberIds.some(id => id.toString() === userId)) {
                    return socket.emit("error", "Not a member of private channel");
                }
            }

            // PUBLIC → no restriction
            socket.join(channelId);
        });

        socket.on("leave_channel", (channelId) => {
            socket.leave(channelId);
        });

        socket.on("send_dm", async ({ conversationId, content }) => {
            const convo = await conversationModel.findById(conversationId);

            if (!convo.members.some(id => id.toString() === userId)) {
                throw new Error("Not part of conversation");
            }
            const message = await createMessageService({
                conversationId,
                senderId: socket.user.userId,
                content,
            });

            io.to(conversationId).emit("receive_dm", message);
        });

        socket.on("mark_read", async ({ messageId, channelId }) => {
            try {
                const updatedMessage = await markAsReadService({
                    messageId,
                    userId,
                });

                io.to(channelId).emit("message_read", {
                    messageId,
                    userId,
                });
            } catch (err) {
                socket.emit("error", err.message);
            }
        });
        socket.on("typing_start", ({ channelId }) => {
            startTyping(channelId, userId);

            socket.to(channelId).emit("typing_start", {
                userId,
                channelId,
            });

            // Auto stop after 3s (failsafe)
            setTimeout(() => {
                stopTyping(channelId, userId);
                socket.to(channelId).emit("typing_stop", {
                    userId,
                    channelId,
                });
            }, 3000);
        });

        socket.on("typing_stop", ({ channelId }) => {
            stopTyping(channelId, userId);

            socket.to(channelId).emit("typing_stop", {
                userId,
                channelId,
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
            removeUser(userId, socket.id);
            io.emit("presence_update", getOnlineUsers());
        });
    });

    return io;
};