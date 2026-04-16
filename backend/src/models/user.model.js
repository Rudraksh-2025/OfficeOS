import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    role: {
        type: String,
        enum: ["ADMIN", "MANAGER", "EMPLOYEE"],
        default: "EMPLOYEE",
    },
    department: String,
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);