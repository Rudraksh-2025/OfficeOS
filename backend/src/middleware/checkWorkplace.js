export const checkWorkspace = (req, res, next) => {
    const workspaceId = req.user.workspaceId;

    if (!workspaceId) {
        return res.status(403).json({ message: "Workspace not found" });
    }

    req.workspaceId = workspaceId;

    next();
};