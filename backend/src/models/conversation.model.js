import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["DIRECT", "GROUP"],
        default: "DIRECT",
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],

    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        index: true,
    },

    name: String, // for group chats

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, { timestamps: true });

// 🔥 prevent duplicate 1:1 chat
conversationSchema.index(
    { members: 1, type: 1 },
    { unique: true, partialFilterExpression: { type: "DIRECT" } }
);

export default mongoose.model("Conversation", conversationSchema);