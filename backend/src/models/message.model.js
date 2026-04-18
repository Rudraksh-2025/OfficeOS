import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
        index: true,
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    attachments: [String],

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    readBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        readAt: {
            type: Date,
            default: Date.now,
        },
    }],

}, { timestamps: true });
messageSchema.index({ channelId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);