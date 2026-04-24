import Channel from "../models/channel.model.js";

export const createChannelService = async ({
    name,
    type,
    workspaceId,
    userId,
}) => {
    const channel = await Channel.create({
        name,
        type,
        workspaceId,
        createdBy: userId,
        memberIds: [userId],
    });

    return channel;
};

import mongoose from "mongoose";

export const getChannelsService = async ({ workspaceId, userId }) => {
    return await Channel.aggregate([
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
                $or: [
                    { type: "PUBLIC" },
                    { memberIds: new mongoose.Types.ObjectId(userId) },
                ],
            },
        },
        // messages
        {
            $lookup: {
                from: "messages",
                localField: "_id",
                foreignField: "channelId",
                as: "messages",
            },
        },
        //Get last message
        {
            $addFields: {
                lastMessage: {
                    $arrayElemAt: [
                        { $slice: ["$messages", -1] },
                        0
                    ]
                }
            },
        },
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
                    $arrayElemAt: ["$lastMessageSender.name", 0]
                }
            }
        },
        {
            $project: {
                messages: 0,
                lastMessageSender: 0,
            }
        },

        {
            $sort: {
                "lastMessage.createdAt": -1,
                createdAt: -1
            }
        }
    ]);
};

export const joinChannelService = async ({ channelId, userId }) => {
    const channel = await Channel.findById(channelId);

    if (!channel) throw new Error("Channel not found");

    if (channel.type === "PRIVATE") {
        throw new Error("Cannot join private channel");
    }

    await Channel.findByIdAndUpdate(
        channelId,
        { $addToSet: { memberIds: userId } }
    );

    return { message: "Joined channel" };
};


export const addMemberService = async ({ channelId, userId }) => {
    const channel = await Channel.findById(channelId);

    if (!channel) throw new Error("Channel not found");

    await Channel.findByIdAndUpdate(
        channelId,
        { $addToSet: { memberIds: userId } }
    );

    return { message: "Member added" };
};