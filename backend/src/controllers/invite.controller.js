import {
    createInviteService,
    acceptInviteService,
} from "../services/invite.service.js";

export const createInvite = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (req.user.role !== "ADMIN") {
            throw new Error("Only admins can invite users");
        }
        const data = await createInviteService({
            email,
            role,
            workspaceId: req.user.workspaceId,
            invitedBy: req.user.userId,
        });


        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const acceptInvite = async (req, res) => {
    try {
        const { token, name, password } = req.body;

        const data = await acceptInviteService({ token, name, password });

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};