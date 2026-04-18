import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createMessageService } from "../services/message.service.js";
import {
    addUser,
    removeUser,
    getOnlineUsers,
} from "./presence.js";
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


        // Join channel
        socket.on("join_channel", (channelId) => {
            socket.join(channelId);
        });

        // Send message
        socket.on("send_message", async (data) => {
            try {
                const { channelId, content } = data;

                // Save first
                const message = await createMessageService({
                    channelId,
                    senderId: socket.user.userId,
                    content,
                });

                // Emit to channel
                io.to(channelId).emit("receive_message", message);

            } catch (err) {
                socket.emit("error", err.message);
            }
        });

        socket.on("join_channel", async (channelId) => {
            const channel = await channelModel.findById(channelId);

            if (!channel.memberIds.includes(userId)) {
                throw new Error("Not a member of channel");
            }
            socket.join(channelId);
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