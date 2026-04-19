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

export const getChannelsService = async ({ workspaceId, userId }) => {
    return await Channel.find({
        workspaceId,
        $or: [
            { type: "PUBLIC" },
            { memberIds: userId },
        ],
    }).sort({ createdAt: -1 });
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