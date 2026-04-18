import { ROLE_PERMISSIONS } from "../constants/rolePermissions";

export const authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;

            if (!userRole) {
                return res.status(403).json({ message: "No role assigned" });
            }

            const userPermissions = ROLE_PERMISSIONS[userRole] || [];

            const hasPermission = requiredPermissions.every((perm) =>
                userPermissions.includes(perm)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    message: "Access denied",
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: "Authorization error" });
        }
    };
};