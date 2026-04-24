import Conversation from "../models/conversation.model.js";
import mongoose from "mongoose";

export const getOrCreateDMService = async ({
    userId,
    targetUserId,
    workspaceId,
}) => {
    // sort to maintain uniqueness
    const members = [userId, targetUserId].sort();

    let convo = await Conversation.findOne({
        members,
        type: "DIRECT",
    });

    if (!convo) {
        convo = await Conversation.create({
            type: "DIRECT",
            members,
            workspaceId,
            createdBy: userId,
        });
    }

    return convo;
};

export const createGroupService = async ({
    name,
    members,
    workspaceId,
    userId,
}) => {
    const convo = await Conversation.create({
        type: "GROUP",
        name,
        members: [...members, userId],
        workspaceId,
        createdBy: userId,
    });

    return convo;
};

export const getConversationsService = async ({ userId }) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Conversation.aggregate([
        {
            $match: {
                members: userObjectId,
            },
        },
        // Get last message 
        {
            $lookup: {
                from: "messages",
                let: { convoId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$conversationId", "$$convoId"] },
                        },
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 },
                ],
                as: "lastMessageArr",
            },
        },
        {
            $addFields: {
                lastMessage: { $arrayElemAt: ["$lastMessageArr", 0] },
            },
        },

        // Populate sender
        {
            $lookup: {
                from: "users",
                localField: "lastMessage.senderId",
                foreignField: "_id",
                as: "lastMessageSender",
            },
        },

        {
            $addFields: {
                "lastMessage.senderName": {
                    $arrayElemAt: ["$lastMessageSender.name", 0],
                },
            },
        },

        // Populate members (for UI)
        {
            $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "membersData",
            },
        },

        // DM name logic
        {
            $addFields: {
                name: {
                    $cond: [
                        { $eq: ["$type", "DIRECT"] },
                        {
                            $let: {
                                vars: {
                                    otherUser: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$membersData",
                                                    as: "m",
                                                    cond: {
                                                        $ne: ["$$m._id", userObjectId],
                                                    },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                                in: "$$otherUser.name",
                            },
                        },
                        "$name",
                    ],
                },
            },
        },
        {
            $project: {
                lastMessageArr: 0,
                lastMessageSender: 0,
                membersData: 0,
            },
        },
        //Sort by activity
        {
            $sort: {
                "lastMessage.createdAt": -1,
                updatedAt: -1,
            },
        },
    ]);

    return conversations;
};