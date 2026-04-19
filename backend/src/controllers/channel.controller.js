import {
    createChannelService,
    getChannelsService,
    joinChannelService,
    addMemberService,
} from "../services/channel.service.js";

export const createChannel = async (req, res) => {
    try {
        const { name, type } = req.body;

        const channel = await createChannelService({
            name,
            type,
            workspaceId: req.user.workspaceId,
            userId: req.user.userId,
        });

        res.status(201).json(channel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getChannels = async (req, res) => {
    try {
        const channels = await getChannelsService({
            workspaceId: req.user.workspaceId,
            userId: req.user.userId,
        });

        res.status(200).json(channels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const joinChannel = async (req, res) => {
    try {
        const { channelId } = req.params;

        const data = await joinChannelService({
            channelId,
            userId: req.user.userId,
        });

        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addMember = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { userId } = req.body;

        const data = await addMemberService({ channelId, userId });

        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};