import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ["PUBLIC", "PRIVATE"],
        default: "PUBLIC",
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        index: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    memberIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

}, { timestamps: true });

channelSchema.index({ name: 1, workspaceId: 1 }, { unique: true });

export default mongoose.model("Channel", channelSchema);