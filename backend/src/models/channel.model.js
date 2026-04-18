import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: String,

    type: {
        type: String,
        enum: ["PUBLIC", "PRIVATE"],
        default: "PUBLIC",
    },

    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },

    memberIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);