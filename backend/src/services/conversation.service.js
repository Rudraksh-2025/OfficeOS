import Conversation from "../models/conversation.model";

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
    return await Conversation.find({
        members: userId,
    })
        .populate("members", "name email")
        .sort({ updatedAt: -1 });
};