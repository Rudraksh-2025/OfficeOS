import express from "express";
import { createInvite, acceptInvite } from "../controllers/invite.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { checkWorkspace } from "../middleware/checkWorkplace.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

router.post("/", protect, checkWorkspace, authorize(PERMISSIONS.INVITE_USER), createInvite);
router.post("/accept", acceptInvite);

export default router;