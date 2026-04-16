import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, unique: true },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    memberIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true });

export default mongoose.model("Workspace", workspaceSchema);