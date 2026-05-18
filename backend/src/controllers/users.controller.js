import userModel from "../models/user.model.js";

// GET /users (workspace scoped)
export const getWorkspaceUsers = async (req, res) => {
    const users = await userModel.find({
        workspaceId: req.user.workspaceId
    }).select("_id name email");

    res.json(users);
};