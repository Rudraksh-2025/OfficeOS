import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import workplaceModel from "../models/workplace.model.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendMail.js";

const generateSlug = (name) =>
    name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

export const registerService = async ({ name, email, password, workspaceName }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const workspace = await workplaceModel.create({
        name: workspaceName,
        slug: generateSlug(workspaceName),
    });

    // 🔐 Generate token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
        name,
        email,
        passwordHash,
        role: "ADMIN",
        workspaceId: workspace._id,
        verificationToken,
        verificationTokenExpires: Date.now() + 1000 * 60 * 60,
    });

    workspace.ownerId = user._id;
    workspace.memberIds = [user._id];
    await workspace.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
        email,
        "Verify your OfficeOS account",
        `<h3>Click to verify:</h3><a href="${verifyUrl}">${verifyUrl}</a>`
    );

    return {
        message: "Verification email sent",
    };
};

export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid credentials");

    if (!user.isVerified) {
        throw new Error("Please verify your email first");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user);

    return { user, token };
};

export const verifyEmailService = async (token) => {
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    return { message: "Email verified successfully" };
};