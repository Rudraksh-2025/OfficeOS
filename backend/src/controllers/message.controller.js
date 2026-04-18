import { getMessagesService } from "../services/message.service.js";

export const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { page, limit } = req.query;

        const messages = await getMessagesService({
            channelId,
            page: Number(page),
            limit: Number(limit),
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};