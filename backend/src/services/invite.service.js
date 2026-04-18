import Invite from "../models/invite.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateInviteToken } from "../utils/generateInviteToken.js";
import { sendEmail } from "../utils/sendMail.js";
import Workspace from "../models/workplace.model.js";
import mongoose from "mongoose";

export const createInviteService = async ({ email, role, workspaceId, invitedBy }) => {
    // 1. Prevent duplicate users
    const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //     throw new Error("User already exists in system");
    // }
    if (existingUser) {
        if (existingUser.workspaceId?.toString() === workspaceId.toString()) {
            throw new Error("User already in this workspace");
        }
    }

    // 2. Generate token
    const { rawToken, hashedToken } = generateInviteToken();

    const existingInvite = await Invite.findOne({
        email,
        workspaceId,
        status: "PENDING",
    });

    if (existingInvite) {
        throw new Error("Invite already sent to this user");
    }

    // 3. Create invite
    const invite = await Invite.create({
        email,
        role,
        workspaceId,
        invitedBy,
        token: hashedToken,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h
    });

    // 4. Send email
    const inviteUrl = `${process.env.CLIENT_URL}/accept-invite?token=${rawToken}`;

    await sendEmail(
        email,
        "You're invited to OfficeOS",
        `<h3>Join workspace:</h3><a href="${inviteUrl}">${inviteUrl}</a>`
    );

    return { message: "Invite sent successfully" };
};

export const acceptInviteService = async ({ token, name, password }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Hash token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 2. Find invite (lock it inside transaction)
        const invite = await Invite.findOne({
            token: hashedToken,
            expiresAt: { $gt: Date.now() },
            status: "PENDING",
        }).session(session);

        if (!invite) {
            throw new Error("Invalid or expired invite");
        }

        const email = invite.email.toLowerCase();

        // 3. Check if user already exists (idempotency)
        let user = await User.findOne({ email }).session(session);
        if (user) {
            // Attach to workspace instead of creating new user
            user.workspaceId = invite.workspaceId;
            user.role = invite.role;
            await user.save({ session });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            try {
                user = await User.create(
                    [{
                        name,
                        email,
                        passwordHash,
                        role: invite.role,
                        workspaceId: invite.workspaceId,
                        isVerified: true,
                    }],
                    { session }
                );

                user = user[0];
            } catch (error) {
                // Handle race condition (duplicate email)
                if (error.code === 11000) {
                    user = await User.findOne({ email }).session(session);
                } else {
                    throw error;
                }
            }
        }

        // 4. Add user to workspace (avoid duplicates)
        await Workspace.findByIdAndUpdate(
            invite.workspaceId,
            { $addToSet: { memberIds: user._id } },
            { session }
        );

        // 5. Mark invite as accepted (idempotent)
        if (invite.status === "ACCEPTED") {
            // Return existing user instead of failing
            const existingUser = await User.findOne({
                email: invite.email,
                workspaceId: invite.workspaceId,
            });

            return {
                message: "Invite already accepted",
                user: existingUser,
            };
        }

        if (invite.expiresAt < Date.now()) {
            invite.status = "EXPIRED";
            await invite.save({ session });
            throw new Error("Invite expired");
        }
        invite.status = "ACCEPTED";
        await invite.save({ session });

        await session.commitTransaction();
        session.endSession();

        return { user };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};