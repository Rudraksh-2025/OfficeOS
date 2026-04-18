import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
    email: { type: String, required: true },

    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },

    role: {
        type: String,
        enum: ["ADMIN", "MANAGER", "EMPLOYEE"],
        default: "EMPLOYEE",
    },

    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },

    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "EXPIRED"],
        default: "PENDING",
    },
}, { timestamps: true });

export default mongoose.model("Invite", inviteSchema);