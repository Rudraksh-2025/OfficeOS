import {
    getOrCreateDMService,
    createGroupService,
    getConversationsService,
} from "../services/conversation.service.js";

export const createDM = async (req, res) => {
    try {
        const { userId: targetUserId } = req.body;

        const convo = await getOrCreateDMService({
            userId: req.user.userId,
            targetUserId,
            workspaceId: req.user.workspaceId,
        });

        res.status(200).json(convo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;

        const convo = await createGroupService({
            name,
            members,
            workspaceId: req.user.workspaceId,
            userId: req.user.userId,
        });

        res.status(201).json(convo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const convos = await getConversationsService({
            userId: req.user.userId,
        });

        res.status(200).json(convos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};